import { Component } from "@acryps/page";
import { StateComponent } from ".";

export class NotFoundComponent extends StateComponent {
	render() {
		return <ui-not-found>
			<ui-text>The lobby you tried to join couldn't be found.</ui-text>
			<ui-action ui-href=''>Return to home</ui-action>
		</ui-not-found>;
	}
}
