import { Component } from "@acryps/page";
import { StateComponent } from "..";
import { ServerGameAbortMessage } from "../../../../shared/messages/server";

export class GameComponent extends StateComponent {
	constructor (
		private onabort: () => void
	) {
		super();
	}

	onload() {
		this.parent.socket.subscribe(ServerGameAbortMessage, () => this.onabort());
	}

	render() {
		return <ui-game>
			<ui-text>Welcome to the online epic card game "TWENTY-ONE"</ui-text>
		</ui-game>;
	}
}
