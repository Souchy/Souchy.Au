import { customElement, bindable } from 'aurelia';

@customElement('splitgrid')
export class Splitgrid {
	@bindable id: string;
	@bindable mode: 'column' | 'row' = 'column';
	@bindable defaultSizes: number[];
	@bindable mobileMode: 'stack' | 'page' = 'stack';
	@bindable mobileBreakpoint: number = 600;

	private host: HTMLElement;
	private sizes: number[];
	private dragging = false;
	private dragIndex = 0;
	private startPos = 0;
	private startSizes: number[] = [];
	private rafToken: number = 0; // Add to your class
	private panes: Element[];

	get isRow() { return this.mode === 'row'; }

	attached() {
		// console.log('Splitgrid attached:', this.id, this.mode);
		this.setupPanesAndGutters();
	}

	public getPanes() {
		return this.panes;
	}

	setupPanesAndGutters() {
		// Remove old gutters (in case of re-attachment)
		let children = Array.from(this.host.children);

		// Remove any existing gutters
		for (let child of children) {
			if (child.classList.contains('splitgrid-gutter')) child.remove();
		}

		this.panes = children;
		const paneCount = this.panes.length;
		if (!paneCount) return;

		// Load or init sizes
		this.loadSizes(paneCount);

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
			gutter.addEventListener('mousedown', (e) => this.startDrag(i, e));
			gutter.addEventListener('touchstart', (e) => this.startTouchDrag(i, e)); // TOUCH SUPPORT
			gutter.addEventListener('dblclick', () => this.resetSizes());
			this.panes[i].after(gutter);
		}
	}

	startDrag(index: number, event: MouseEvent) {
		this.dragging = true;
		this.dragIndex = index;
		const verticalDrag = this.isRow || this.isMobileStackedColumn();
		this.startPos = verticalDrag ? event.clientY : event.clientX;
		this.startSizes = [...this.sizes];
		document.addEventListener('mousemove', this.onDrag);
		document.addEventListener('mouseup', this.stopDrag);
	}

	onDrag = (event: MouseEvent) => {
		if (!this.dragging) return;

		// Save the event for the next animation frame
		if (this.rafToken) return;
		this.rafToken = requestAnimationFrame(() => {
			this.rafToken = 0;
			// ... your resizing logic here ...
			// Calculate new sizes and update flex-basis as before
			const panes = this.getPanes();
			const verticalDrag = this.isRow || this.isMobileStackedColumn();
			const containerSize = verticalDrag ? this.host.offsetHeight : this.host.offsetWidth;
			const pos = verticalDrag ? event.clientY : event.clientX;
			const deltaPx = pos - this.startPos;
			const deltaPercent = (deltaPx / containerSize) * 100;
			let first = this.startSizes[this.dragIndex] + deltaPercent;
			let second = this.startSizes[this.dragIndex + 1] - deltaPercent;
			if (first < 5 || second < 5) return;
			this.sizes[this.dragIndex] = first;
			this.sizes[this.dragIndex + 1] = second;
			// Update flex-basis
			(panes[this.dragIndex] as HTMLElement).style.flexBasis = `${first}%`;
			(panes[this.dragIndex + 1] as HTMLElement).style.flexBasis = `${second}%`;
		});

	};

	stopDrag = () => {
		this.dragging = false;
		document.removeEventListener('mousemove', this.onDrag);
		document.removeEventListener('mouseup', this.stopDrag);

		// Save sizes
		this.saveSizes();
	};

	// Add these handlers:
	startTouchDrag(index: number, event: TouchEvent) {
		this.dragging = true;
		this.dragIndex = index;
		const verticalDrag = this.isRow || this.isMobileStackedColumn();
		this.startPos = verticalDrag ? event.touches[0].clientY : event.touches[0].clientX;
		this.startSizes = [...this.sizes];
		document.addEventListener('touchmove', this.onTouchDrag, { passive: false });
		document.addEventListener('touchend', this.stopTouchDrag);
	}

	onTouchDrag = (event: TouchEvent) => {
		event.preventDefault(); // Prevent scrolling while resizing
		if (!this.dragging) return;
		if (this.rafToken) return;
		this.rafToken = requestAnimationFrame(() => {
			this.rafToken = 0;
			const panes = this.getPanes();
			const verticalDrag = this.isRow || this.isMobileStackedColumn();
			const containerSize = verticalDrag ? this.host.offsetHeight : this.host.offsetWidth;
			const pos = verticalDrag ? event.touches[0].clientY : event.touches[0].clientX;
			const deltaPx = pos - this.startPos;
			const deltaPercent = (deltaPx / containerSize) * 100;
			let first = this.startSizes[this.dragIndex] + deltaPercent;
			let second = this.startSizes[this.dragIndex + 1] - deltaPercent;
			if (first < 5 || second < 5) return;
			this.sizes[this.dragIndex] = first;
			this.sizes[this.dragIndex + 1] = second;
			(panes[this.dragIndex] as HTMLElement).style.flexBasis = `${first}%`;
			(panes[this.dragIndex + 1] as HTMLElement).style.flexBasis = `${second}%`;
		});
	};

	stopTouchDrag = () => {
		this.dragging = false;
		document.removeEventListener('touchmove', this.onTouchDrag);
		document.removeEventListener('touchend', this.stopTouchDrag);
		if (this.id)
			localStorage.setItem(`splitgrid:sizes:${this.id}`, JSON.stringify(this.sizes));
	};

	resetSizes() {
		const panes = this.getPanes();
		const paneCount = panes.length;
		// Prefer defaultSizes, else even split
		if (this.defaultSizes && this.defaultSizes.length === paneCount) {
			this.sizes = [...this.defaultSizes];
		} else {
			this.sizes = Array(paneCount).fill(100 / paneCount);
		}
		// Apply and persist
		panes.forEach((pane, i) => {
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
