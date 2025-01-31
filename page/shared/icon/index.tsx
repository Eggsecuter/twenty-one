import { Component } from "@acryps/page";
import { Application } from "../..";

export type Icon = 'settings' | 'leave' | 'players' | 'chat';

export class IconComponent extends Component {
	private iconElement: SVGElement;

	constructor (
		private icon: Icon
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
