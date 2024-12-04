import { Component } from "@acryps/page";
import { Player } from "../../../../shared/player";
import { LobbyComponent } from ".";
import { PlayerComponent } from "../../player";

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
			return <ui-player ui-missing>
				<ui-avatar></ui-avatar>

				<ui-name>Competitor missing</ui-name>
			</ui-player>;
		}

		return new PlayerComponent(this.parent.parent, player);
	}
}
