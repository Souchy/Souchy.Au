import { ICustomAttributeViewModel, IEventAggregator, bindable, inject } from 'aurelia';

@inject(HTMLElement, IEventAggregator)
export class ModalTargetCustomAttribute implements ICustomAttributeViewModel {

	@bindable value: string | undefined;

	constructor(private element: HTMLElement, private ea: IEventAggregator) {
		console.log("ele:", element);
		console.log("ea:", ea);
	}

	attached() {
		console.log("attach", this.element)
		this.element.addEventListener('click', this.onClick);
	}

	detached() {
		this.element.removeEventListener('click', this.onClick);
	}

	onClick = (event: MouseEvent) => {
		let modalId = this.value;
		if (!modalId) return;
		// Remove leading "#" if present
		if (modalId.startsWith('#')) {
			modalId = modalId.slice(1);
		}
		this.ea.publish('open-modal', modalId);
	}
}
