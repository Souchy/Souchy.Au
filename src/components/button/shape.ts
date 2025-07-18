import { ICustomAttributeViewModel, IEventAggregator, bindable, customAttribute, inject } from 'aurelia';

@inject(Element, IEventAggregator)
@customAttribute('shape')
export class ShapeCustomAttribute implements ICustomAttributeViewModel {

	@bindable value: "square" | "round";
	element: Element;

	constructor(element: Element, private ea: IEventAggregator) {
		this.element = element;
		this.ea = ea;
	}

	attached() {
		this.element.classList.add(this.value);
	}

	detached() {
		this.element.classList.remove(this.value);
	}
}
