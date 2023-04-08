import { Component } from "vldom";

Component.directives['ui-keyup'] = (element: HTMLInputElement, value) => {
	element.onkeyup = () => {
		value(element.value);
	}
}
 