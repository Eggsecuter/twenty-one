import { Component } from "@acryps/page";
import { competitorStartHealth } from "../../shared/game-settings";

export class CompetitorComponent extends Component {
	health = competitorStartHealth;
	cards: number[] = [];

	constructor (
		public playerId: string
	) {
		super();
	}

	render() {
		return <ui-competitor>
			<ui-cards>
				{this.cards.map(card => <ui-card>{card ?? 'H'}</ui-card>)}
			</ui-cards>
		</ui-competitor>;
	}
}