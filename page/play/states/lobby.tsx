import { Component } from "@acryps/page";
import { StateComponent } from ".";

export class LobbyComponent extends StateComponent {
	render() {
		return <ui-lobby>
			{this.parent.chatComponent}
		</ui-lobby>;
	}
}
