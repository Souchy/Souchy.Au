import { bindable, customElement, IEventAggregator, inject } from 'aurelia';

@inject(IEventAggregator)
@customElement('modal')
export class Modal {
	@bindable public header: string;
	@bindable public okCallback: () => void;
	@bindable public cancelCallback?: () => void;
	@bindable public draggable: boolean = false;
	@bindable public footer: boolean = false;
	@bindable public cancel: boolean = false;

	private opened: boolean = false;

	private offsetX = 0;
	private offsetY = 0;
	private dragging = false;
	private modalEl: HTMLElement;

	@bindable id: string;
	private subscription: any;

	constructor(private ea: IEventAggregator) { }

	attached() {
		// console.log('Modal attached:', this.id);
		this.subscription = this.ea.subscribe('open-modal', (modalId: string) => {
			if (modalId === this.id) {
				this.open();
			}
		});
	}

	detached() {
		if (this.subscription) {
			this.subscription.dispose();
		}
	}

	public open() {
		this.opened = true;
		// console.log('Modal opened:', this.id);
	}
	public close() { this.opened = false; }

	startDrag(event: MouseEvent) {
		if (!this.draggable) return;
		this.dragging = true;
		const rect = this.modalEl.getBoundingClientRect();
		this.offsetX = event.clientX - rect.left;
		this.offsetY = event.clientY - rect.top;
		document.addEventListener('mousemove', this.onDrag);
		document.addEventListener('mouseup', this.stopDrag);
	}

	onDrag = (event: MouseEvent) => {
		if (!this.dragging) return;
		this.modalEl.style.left = `${event.clientX - this.offsetX}px`;
		this.modalEl.style.top = `${event.clientY - this.offsetY}px`;
		this.modalEl.style.transform = 'none';
	};

	stopDrag = () => {
		if (!this.dragging) return;
		this.dragging = false;
		document.removeEventListener('mousemove', this.onDrag);
		document.removeEventListener('mouseup', this.stopDrag);
	};

	clickOk() {
		if (typeof this.okCallback === 'function') {
			this.okCallback();
		}
		this.opened = false;
	}

	clickCancel() {
		// console.log('Modal cancelled', this.id);
		if (typeof this.cancelCallback === 'function') {
			this.cancelCallback();
		}
		this.opened = false;
	}
}
