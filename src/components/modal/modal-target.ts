import { ICustomAttributeViewModel, IEventAggregator, bindable, customAttribute, inject } from 'aurelia';

@inject(Element, IEventAggregator)
@customAttribute('modal-target')
export class ModalTargetCustomAttribute implements ICustomAttributeViewModel {

	@bindable value: string;
	element: Element;

	constructor(element: Element, private ea: IEventAggregator) {
		this.element = element;
		this.ea = ea;
	}

	attached() {
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
