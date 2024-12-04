import { Component } from "@acryps/page";
import { LobbyComponent } from ".";
import { PlayerComponent } from "../../player";

export class SpectatorsComponent extends Component {
	declare parent: LobbyComponent;

	render() {
		const spectators = this.parent.parent.players.slice(2);

		return <ui-spectators>
			<ui-title>Spectators</ui-title>

			{!spectators.length && <ui-hint>No spectators</ui-hint>}

			<ui-spectator-list>
				{spectators.map(spectator => new PlayerComponent(this.parent.parent, spectator))}
			</ui-spectator-list>
		</ui-spectators>;
	}
}
