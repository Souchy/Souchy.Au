// Updated Splitgrid with Pointer Events based resizing (unified mouse/touch/pen)
import { customElement, bindable } from 'aurelia';

@customElement('splitgrid')
export class Splitgrid {
	@bindable id: string;
	@bindable mode: 'column' | 'row' = 'column';
	@bindable mobileBehavior: 'stack' | 'paged' = 'paged';
	@bindable mobileBreakpoint: number = 600;
	@bindable defaultSizes: number[];

	private host: HTMLElement;
	private sizes: number[] = [];
	private dragging = false;
	private dragIndex = 0;
	private startPos = 0;
	private startSizes: number[] = [];
	private rafToken = 0;

	// pointer-based drag session state
	private dragPanes: HTMLElement[] | null = null;
	private activeRafId = 0;
	private activeGutterEl: HTMLElement | null = null;
	private activePointerId: number | null = null;

	private currentPage = 0;
	private wasPaged = false;
	private resizeRaf = 0;

	// configuration
	private readonly MIN_PERCENT = 5; // minimum percent for a pane (make bindable if desired)
	private readonly KEY_NUDGE_PERCENT = 2; // percent change per arrow key press

	get isRow() { return this.mode === 'row'; }

	private get isPaged(): boolean {
		try {
			return this.mode === 'column' && this.mobileBehavior === 'paged' && window.innerWidth <= this.mobileBreakpoint;
		} catch {
			return false;
		}
	}

	attached() {
		// Defer setup so nested attributes/bindings are applied
		// Promise.resolve().then(() => {
			this.setupPanesAndGutters();
			this.wasPaged = this.isPaged;
		// });

		window.addEventListener('resize', this.onResize);
		this.host.addEventListener('scroll', this.onScroll, { passive: true });
	}

	detached() {
		window.removeEventListener('resize', this.onResize);
		this.host.removeEventListener('scroll', this.onScroll as EventListener);
		// ensure any capture is released and listeners cleaned
		if (this.activeGutterEl && this.activePointerId != null) {
			try { this.activeGutterEl.releasePointerCapture(this.activePointerId); } catch { }
		}
		this.removeActiveGutterListeners();
		if (this.activeRafId) cancelAnimationFrame(this.activeRafId);
		if (this.resizeRaf) cancelAnimationFrame(this.resizeRaf);
	}

	public getPanes() {
		return Array.from(this.host.children).filter(el => !el.classList.contains('splitgrid-gutter')) as HTMLElement[];
	}

	public getGutters() {
		return Array.from(this.host.children).filter(el => el.classList.contains('splitgrid-gutter')) as HTMLElement[];
	}

	setupPanesAndGutters() {
		// Remove old gutters
		let children = Array.from(this.host.children);
		for (let child of children) {
			if (child.classList.contains('splitgrid-gutter')) child.remove();
		}

		const panes = this.getPanes();
		const paneCount = panes.length;
		if (!paneCount) return;

		this.loadSizes(paneCount);

		if (this.isPaged) {
			this.host.classList.add('paged');
			if (this.currentPage >= paneCount) this.currentPage = 0;
			panes.forEach((pane) => {
				const ele = pane as HTMLElement;
				ele.style.flexBasis = `100%`;
				ele.style.flex = '0 0 100%';
				ele.classList.add('splitgrid-pane');
			});
			requestAnimationFrame(() => {
				this.host.scrollLeft = this.currentPage * this.host.clientWidth;
			});
		} else {
			this.host.classList.remove('paged');

			panes.forEach((pane, i) => {
				const ele = pane as HTMLElement;
				this.applyPaneSize(ele, i, paneCount);
				ele.classList.add('splitgrid-pane');
			});

			// Insert gutters + pointer handlers
			for (let i = 0; i < paneCount - 1; ++i) {
				const gutter = document.createElement('div');
				gutter.className = 'splitgrid-gutter';
				// accessibility
				gutter.setAttribute('role', 'separator');
				const orientation = this.isRow ? 'horizontal' : 'vertical';
				gutter.setAttribute('aria-orientation', orientation);
				gutter.tabIndex = 0;

				// Pointer events
				gutter.addEventListener('pointerdown', (e) => this.onGutterPointerDown(i, e as PointerEvent));

				// Keyboard for nudging
				gutter.addEventListener('keydown', (e) => this.onGutterKeyDown(i, e as KeyboardEvent));

				// double click to reset sizes
				gutter.addEventListener('dblclick', () => this.resetSizes());

				panes[i].after(gutter);
			}

			// Force layout to avoid blank-looking render
			requestAnimationFrame(() => { void this.host.getBoundingClientRect(); });
		}
	}

	// POINTER-BASED HANDLERS (unify mouse/touch/pen)
	private onGutterPointerDown = (index: number, ev: PointerEvent) => {
		// Only left button / primary
		if (ev.button !== undefined && ev.button !== 0) return;
		ev.preventDefault();

		const gutterEl = ev.currentTarget as HTMLElement;
		try {
			gutterEl.setPointerCapture(ev.pointerId);
		} catch { /* some browsers may throw if capture unavailable */ }

		this.activeGutterEl = gutterEl;
		this.activePointerId = ev.pointerId;
		this.dragging = true;
		this.dragIndex = index;
		const verticalDrag = this.isRow || this.isMobileStackedColumn();
		this.startPos = verticalDrag ? ev.clientY : ev.clientX;
		this.startSizes = [...this.sizes];
		this.dragPanes = this.getPanes();

		// attach move/up handlers to the gutter element (events will be routed to it while captured)
		gutterEl.addEventListener('pointermove', this.onGutterPointerMove);
		gutterEl.addEventListener('pointerup', this.onGutterPointerUp);
		gutterEl.addEventListener('lostpointercapture', this.onGutterPointerUp);
	};

	private onGutterPointerMove = (ev: PointerEvent) => {
		if (!this.dragging || this.activePointerId !== ev.pointerId) return;

		// throttle via single rAF token
		if (this.activeRafId) return;

		this.activeRafId = requestAnimationFrame(() => {
			this.activeRafId = 0;
			if (!this.dragging) return;

			const panes = this.dragPanes ?? this.getPanes();
			const verticalDrag = this.isRow || this.isMobileStackedColumn();
			const containerSize = verticalDrag ? this.host.clientHeight : this.host.clientWidth;
			const pos = verticalDrag ? ev.clientY : ev.clientX;
			const deltaPx = pos - this.startPos;
			const deltaPercent = (deltaPx / Math.max(1, containerSize)) * 100;

			let first = this.startSizes[this.dragIndex] + deltaPercent;
			let second = this.startSizes[this.dragIndex + 1] - deltaPercent;

			if (first < this.MIN_PERCENT || second < this.MIN_PERCENT) return;

			this.sizes[this.dragIndex] = first;
			this.sizes[this.dragIndex + 1] = second;

			const firstPane = panes[this.dragIndex] as HTMLElement;
			const secondPane = panes[this.dragIndex + 1] as HTMLElement;
			
			if (firstPane) this.applyPaneSize(firstPane, this.dragIndex, panes.length);
			if (secondPane) this.applyPaneSize(secondPane, this.dragIndex + 1, panes.length);
		});
	};

	private onGutterPointerUp = (ev: PointerEvent) => {
		// only handle matching pointer
		if (this.activePointerId !== null && ev.pointerId !== this.activePointerId) return;

		// Release capture where possible
		try {
			if (this.activeGutterEl && this.activePointerId != null) {
				this.activeGutterEl.releasePointerCapture(this.activePointerId);
			}
		} catch { }

		this.removeActiveGutterListeners();

		this.dragging = false;
		this.activePointerId = null;
		this.dragPanes = null;

		if (this.activeRafId) {
			cancelAnimationFrame(this.activeRafId);
			this.activeRafId = 0;
		}

		this.saveSizes();
	};

	private removeActiveGutterListeners() {
		if (!this.activeGutterEl) return;
		this.activeGutterEl.removeEventListener('pointermove', this.onGutterPointerMove);
		this.activeGutterEl.removeEventListener('pointerup', this.onGutterPointerUp);
		this.activeGutterEl.removeEventListener('lostpointercapture', this.onGutterPointerUp);
		this.activeGutterEl = null;
	}

	// keyboard support on gutters to nudge resize
	private onGutterKeyDown = (index: number, e: KeyboardEvent) => {
		const isVertical = this.isRow || this.isMobileStackedColumn();
		const leftOrUp = (e.key === 'ArrowLeft' && !isVertical) || (e.key === 'ArrowUp' && isVertical);
		const rightOrDown = (e.key === 'ArrowRight' && !isVertical) || (e.key === 'ArrowDown' && isVertical);
		if (!leftOrUp && !rightOrDown) return;

		e.preventDefault();
		const delta = leftOrUp ? -this.KEY_NUDGE_PERCENT : this.KEY_NUDGE_PERCENT;

		let first = (this.sizes[index] || 0) + delta;
		let second = (this.sizes[index + 1] || 0) - delta;
		if (first < this.MIN_PERCENT || second < this.MIN_PERCENT) return;

		this.sizes[index] = first;
		this.sizes[index + 1] = second;

		const panes = this.getPanes();
		const a = panes[index] as HTMLElement;
		const b = panes[index + 1] as HTMLElement;
		
		if (a) this.applyPaneSize(a, index, panes.length);
		if (b) this.applyPaneSize(b, index + 1, panes.length);

		this.saveSizes();
	};

	// Keep resetSizes/load/save as before (ensure flex locked)
	resetSizes() {
		const panes = this.getPanes();
		const paneCount = panes.length;
		if (this.defaultSizes && this.defaultSizes.length === paneCount) {
			this.sizes = [...this.defaultSizes];
		} else {
			this.sizes = Array(paneCount).fill(100 / paneCount);
		}
		panes.forEach((pane, i) => {
			this.applyPaneSize(pane as HTMLElement, i, paneCount);
		});
		this.saveSizes();
	}

	private loadSizes(paneCount: number) {
		if (this.id) {
			const saved = localStorage.getItem(`splitgrid:sizes:${this.id}`);
			if (saved) try {
				const parsed = JSON.parse(saved);
				if (Array.isArray(parsed) && parsed.length === paneCount) {
					this.sizes = parsed;
					return;
				}
			} catch { }
		}
		if (this.defaultSizes && this.defaultSizes.length === paneCount) {
			this.sizes = [...this.defaultSizes];
			return;
		}
		this.sizes = Array(paneCount).fill(100 / paneCount);
	}

	private saveSizes() {
		if (!this.isPaged && this.id) {
			localStorage.setItem(`splitgrid:sizes:${this.id}`, JSON.stringify(this.sizes));
		}
	}

	private isMobileStackedColumn(): boolean {
		if (this.mode !== 'column') return false;
		const style = window.getComputedStyle(this.host);
		return style.flexDirection === 'column';
	}

	/**
	 * Apply flex styles to a pane. Last pane flexes to fill remaining space,
	 * all others get fixed percentage sizes.
	 */
	private applyPaneSize(pane: HTMLElement, index: number, totalPanes: number) {
		if (index < totalPanes - 1) {
			// Fixed size for all but the last pane
			// pane.style.flexBasis = `${this.sizes[index]}%`;
			pane.style.flex = `0 0 ${this.sizes[index]}%`;
		} else {
			// Last pane fills remaining space
			// pane.style.flexBasis = '0';
			pane.style.flex = '1 1 0';
		}
	}

	private onResize = () => {
		if (this.resizeRaf) return;
		this.resizeRaf = requestAnimationFrame(() => {
			this.resizeRaf = 0;
			const nowPaged = this.isPaged;
			if (nowPaged !== this.wasPaged) {
				this.wasPaged = nowPaged;
				this.setupPanesAndGutters();
			} else {
				if (this.isPaged) {
					this.host.scrollLeft = this.currentPage * this.host.clientWidth;
				}
			}
		});
	};

	private onScroll = () => {
		if (!this.isPaged) return;
		if (this.rafToken) return;
		this.rafToken = requestAnimationFrame(() => {
			this.rafToken = 0;
			const page = Math.round(this.host.scrollLeft / this.host.clientWidth);
			if (page !== this.currentPage) this.currentPage = page;
		});
	};

	public nextPage() {
		const panes = this.getPanes();
		if (!this.isPaged) return;
		if (this.currentPage < panes.length - 1) {
			this.currentPage++;
			this.host.scrollTo({ left: this.currentPage * this.host.clientWidth, behavior: 'smooth' });
		}
	}

	public prevPage() {
		if (!this.isPaged) return;
		if (this.currentPage > 0) {
			this.currentPage--;
			this.host.scrollTo({ left: this.currentPage * this.host.clientWidth, behavior: 'smooth' });
		}
	}
}
