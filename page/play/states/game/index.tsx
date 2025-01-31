import { Component } from "@acryps/page";
import { StateComponent } from "..";

export class GameComponent extends StateComponent {
	render() {
		return <ui-game>
			<ui-text>Welcome to the online epic card game "TWENTY-ONE"</ui-text>

			{this.parent.players.map(player => player.name).join()}
		</ui-game>;
	}
}
