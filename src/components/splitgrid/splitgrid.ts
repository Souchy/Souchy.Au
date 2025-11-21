import { customElement, bindable } from 'aurelia';

@customElement('splitgrid')
export class Splitgrid {
	@bindable id: string;
	@bindable mode: 'column' | 'row' = 'column';
	@bindable defaultSizes: number[];
	@bindable mobileMode: 'stack' | 'page' = 'stack';
	@bindable mobileBreakpoint: number = 600;

	private static readonly minimumPaneSizePercent = 5; // Minimum size for a pane in percent
	private host: HTMLElement;
	private sizes: number[];
	private dragging = false;
	private dragIndex = 0;
	private startPos = 0;
	private startSizes: number[] = [];
	private rafToken: number = 0; // Add to your class
	private panes: Element[];
	private activePointerId: number | null = null;
	private activeGutter: HTMLElement | null = null;

	get isRow() { return this.mode === 'row'; }

	attached() {
		// console.log('Splitgrid attached:', this.id, this.mode);
		this.setupPanesAndGutters();
	}

	get mobileModeClass() {
		return 'splitgrid-' + this.mobileMode;
	}

	setupPanesAndGutters() {
		// Remove old gutters (in case of re-attachment)
		let children = Array.from(this.host.children);

		// Remove any existing gutters
		for (let child of children) {
			if (child.classList.contains('splitgrid-gutter')) 
				child.remove();
		}

		this.panes = children;
		const paneCount = this.panes.length;
		if (!paneCount) return;

		// Load or init sizes
		this.loadSizes(paneCount);

		// Add mobile mode class
		this.host.classList.add(this.mobileModeClass);

		// Apply pane style + initial sizes
		this.panes.forEach((pane, i) => {
			const ele = pane as HTMLElement;
			ele.style.flexBasis = `${this.sizes[i]}%`;
			ele.classList.add('splitgrid-pane');
			// ele.style.flexGrow = '0';
			// ele.style.flexShrink = '0';
			// ele.style.minHeight = '0'; // allow nested flex to shrink
			// ele.style.minWidth = '0';
		});

		// Insert gutters between panes
		for (let i = 0; i < paneCount - 1; ++i) {
			const gutter = document.createElement('div');
			gutter.className = 'splitgrid-gutter';
			// Use pointer events to unify mouse/touch/pen
			gutter.addEventListener('pointerdown', (e) => this.startPointerDrag(i, e));
			gutter.addEventListener('dblclick', () => this.resetSizes());
			this.panes[i].after(gutter);
		}
	}

	// Pointer-based drag handlers (unifies mouse/touch/pen)
	startPointerDrag(index: number, event: PointerEvent) {
		// Prevent text selection/scroll
		event.preventDefault();
		this.dragging = true;
		this.dragIndex = index;
		const verticalDrag = this.isRow || this.isMobileStackedColumn();
		this.startPos = verticalDrag ? event.clientY : event.clientX;
		this.startSizes = [...this.sizes];
		// Track active pointer and gutter element so we can release capture later
		this.activePointerId = event.pointerId;
		this.activeGutter = event.currentTarget as HTMLElement;
		if (this.activeGutter) {
			try {
				this.activeGutter.setPointerCapture(event.pointerId);
			} catch { }
		}
		document.addEventListener('pointermove', this.onPointerDrag);
		document.addEventListener('pointerup', this.stopPointerDrag);
		document.addEventListener('pointercancel', this.stopPointerDrag);
	}

	onPointerDrag = (event: PointerEvent) => {
		if (!this.dragging) return;

		// Save the event for the next animation frame
		if (this.rafToken) return;
		this.rafToken = requestAnimationFrame(() => {
			this.rafToken = 0;
			// ... your resizing logic here ...
			// Calculate new sizes and update flex-basis as before
			const verticalDrag = this.isRow || this.isMobileStackedColumn();
			const containerSize = verticalDrag ? this.host.offsetHeight : this.host.offsetWidth;
			const pos = verticalDrag ? event.clientY : event.clientX;
			const deltaPx = pos - this.startPos;
			const deltaPercent = (deltaPx / containerSize) * 100;
			let first = this.startSizes[this.dragIndex] + deltaPercent;
			let second = this.startSizes[this.dragIndex + 1] - deltaPercent;
			if (first < Splitgrid.minimumPaneSizePercent || second < Splitgrid.minimumPaneSizePercent) 
				return;
			this.sizes[this.dragIndex] = first;
			this.sizes[this.dragIndex + 1] = second;
			// Update flex-basis
			(this.panes[this.dragIndex] as HTMLElement).style.flexBasis = `${first}%`;
			(this.panes[this.dragIndex + 1] as HTMLElement).style.flexBasis = `${second}%`;
		});
	};

	stopPointerDrag = (event?: PointerEvent | Event) => {
		this.dragging = false;
		document.removeEventListener('pointermove', this.onPointerDrag);
		document.removeEventListener('pointerup', this.stopPointerDrag);
		document.removeEventListener('pointercancel', this.stopPointerDrag);
		// Release pointer capture if possible
		if (this.activeGutter && this.activePointerId != null) {
			try {
				this.activeGutter.releasePointerCapture(this.activePointerId);
			} catch { }
		}
		this.activeGutter = null;
		this.activePointerId = null;
		// Save sizes
		this.saveSizes();
	};

	resetSizes() {
		const paneCount = this.panes.length;
		// Prefer defaultSizes, else even split
		if (this.defaultSizes && this.defaultSizes.length === paneCount) {
			this.sizes = [...this.defaultSizes];
		} else {
			this.sizes = Array(paneCount).fill(100 / paneCount);
		}
		// Apply and persist
		this.panes.forEach((pane, i) => {
			(pane as HTMLElement).style.flexBasis = `${this.sizes[i]}%`;
		});
		this.saveSizes();
	}

	private loadSizes(paneCount: number) {
		if (this.id) {
			const saved = localStorage.getItem(`splitgrid:sizes:${this.id}`);
			if (saved) try {
				const parsed = JSON.parse(saved);
				if (Array.isArray(parsed) && parsed.length === paneCount)
					this.sizes = parsed;
			} catch { }
		}
		if (!this.sizes && this.defaultSizes && this.defaultSizes.length === paneCount) {
			this.sizes = [...this.defaultSizes];
		}
		if (!this.sizes || this.sizes.length !== paneCount) {
			this.sizes = Array(paneCount).fill(100 / paneCount); // Default to equal sizes
		}
	}

	private saveSizes() {
		if (this.id)
			localStorage.setItem(`splitgrid:sizes:${this.id}`, JSON.stringify(this.sizes));
	}

	private isMobileStackedColumn(): boolean {
		// Only applies if this.mode === 'column'
		if (this.mode !== 'column') return false;
		// Check computed style for flex-direction
		const style = window.getComputedStyle(this.host);
		return style.flexDirection === 'column';
	}

}
