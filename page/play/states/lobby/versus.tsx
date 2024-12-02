import { Component } from "@acryps/page";
import { Player } from "../../../../shared/player";
import { characterSources } from "../../../shared/characters-sources";
import { LobbyComponent } from ".";

export class VersusComponent extends Component {
	declare parent: LobbyComponent;

	render() {
		return <ui-versus>
			{this.renderCompetitor(this.parent.parent.players[0])}
			{this.renderCompetitor(this.parent.parent.players[1])}
		</ui-versus>;
	}

	renderCompetitor(player: Player) {
		if (!player) {
			return <ui-competitor ui-missing>
				<ui-avatar></ui-avatar>

				<ui-name>Competitor missing</ui-name>
			</ui-competitor>;
		}

		return <ui-competitor>
			<ui-avatar>
				<img src={characterSources[player.character]} />
			</ui-avatar>

			<ui-name>
				{this.parent.parent.players.indexOf(player) == 0 && '[Host] '}
				{player.name}
				{player.id == this.parent.parent.player.id && ' (You)'}
			</ui-name>
		</ui-competitor>;
	}
}
