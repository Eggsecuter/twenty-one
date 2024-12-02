import { Component } from "@acryps/page";
import { LobbyComponent } from ".";
import { characterSources } from "../../../shared/characters-sources";

export class SpectatorsComponent extends Component {
	declare parent: LobbyComponent;

	render() {
		const spectators = this.parent.parent.players.slice(2);

		return <ui-spectators>
			<ui-title>Spectators</ui-title>

			{!spectators.length && <ui-hint>No spectators</ui-hint>}

			<ui-spectator-list>
				{spectators.map(spectator => <ui-spectator>
					<ui-avatar>
						<img src={characterSources[spectator.character]} />
					</ui-avatar>

					<ui-name>
						{this.parent.parent.players.indexOf(spectator) == 0 && '[Host] '}
						{spectator.name}
						{spectator.id == this.parent.parent.player.id && ' (You)'}
					</ui-name>
				</ui-spectator>)}
			</ui-spectator-list>
		</ui-spectators>;
	}
}
