import { ICustomAttributeViewModel, IEventAggregator, bindable, customAttribute, inject } from 'aurelia';
import { Events } from '../..';

const toggledClass = 'toggled';

@inject(Element, IEventAggregator)
@customAttribute('radiogroup')
export class RadioGroupCustomAttribute implements ICustomAttributeViewModel {

	@bindable value: string | undefined;
	element: Element;
	radios: Element[] = [];

	constructor(element: Element, private ea: IEventAggregator) {
		this.element = element;
		this.ea = ea;
	}

	attached() {
		let children = Array.from(this.element.children);
		// console.log("RadioGroup attached, children:", children);
		this.radios = children.filter(child => {
			let radio = child.attributes.getNamedItem('radio');
			if (!radio) return false;
			return radio.value === this.value; // take only radio children with matching value (could be undefined)
		});
		// console.log("Filtered radios:", this.radios);
		for (const radio of this.radios) {
			radio.addEventListener('click', this.handleClick);
		}
	}

	detached() {
		for (const radio of this.radios) {
			radio.removeEventListener('click', this.handleClick);
		}
		this.radios = [];
	}

	handleClick = (event: MouseEvent) => {
		let targetElement = event.currentTarget as Element;
		if (targetElement.classList.contains(toggledClass)) {
			// Already checked, do nothing
			return;
		}

		// Uncheck all radios in the group
		for (const radio of this.radios) {
			radio.classList.remove(toggledClass);
			(radio as HTMLElement).setAttribute('aria-checked', 'false');
		}
		// Check the clicked radio
		targetElement.classList.add(toggledClass);
		(targetElement as HTMLElement).setAttribute('aria-checked', 'true');

		// console.log("Radio button clicked, checked state:", targetElement);
		this.element.dispatchEvent(new CustomEvent(Events.RadioChanged, { detail: { element: targetElement } }));
	}

}
