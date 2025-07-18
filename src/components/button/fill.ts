import { ICustomAttributeViewModel, IEventAggregator, bindable, customAttribute, inject } from 'aurelia';

@inject(Element, IEventAggregator)
@customAttribute('fill')
export class FillCustomAttribute implements ICustomAttributeViewModel {

	@bindable value: "clear" | "invert" | "outline" | "solid";
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
