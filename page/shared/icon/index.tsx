import { Component } from "@acryps/page";
import { Application } from "../..";

export class IconComponent extends Component {
	private iconElement: SVGElement;

	constructor (
		private icon: 'settings' | 'leave' | 'players' | 'chat'
	) {
		super();
	}

	async onload() {
		const source = await Application.get(`/assets/icons/${this.icon}.svg`, 'text');

		this.iconElement = new DOMParser().parseFromString(source, 'image/svg+xml').children[0] as SVGElement;
	}

	render() {
		return this.iconElement;
	}
}
