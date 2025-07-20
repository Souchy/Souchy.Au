import { ICustomAttributeViewModel, IEventAggregator, bindable, customAttribute, inject } from 'aurelia';
import { Events } from '../..';

const toggledClass = 'toggled';

@inject(Element, IEventAggregator)
@customAttribute('toggleable')
export class ToggleableCustomAttribute implements ICustomAttributeViewModel {

	element: Element;

	constructor(element: Element, private ea: IEventAggregator) {
		this.element = element;
		this.ea = ea;
	}

	attached() {
		this.element.addEventListener('click', this.handleClick);
	}

	detached() {
		this.element.removeEventListener('click', this.handleClick);
	}

	handleClick = () => {
		let isToggled = this.element.classList.toggle(toggledClass);
		// console.log("Toggleable button clicked, toggled state:", isToggled);
		this.element.dispatchEvent(new CustomEvent(Events.ToggleableChanged, { detail: { isToggled: isToggled } }));
	}
}
