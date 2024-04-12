import { Component } from "@acryps/page";
import { competitorStartHealth } from "../../shared/game-settings";
import { BoardComponent } from "./board";

export class CompetitorComponent extends Component {
	declare parent: BoardComponent;

	private health = competitorStartHealth;
	private cards: number[] = [];

	constructor (
		public playerId: string
	) {
		super();
	}

	draw(card?: number) {
		this.cards.push(card);
		this.update();
	}

	render() {
		return <ui-competitor ui-active={this.parent.activeCompetitorId == this.playerId}>
			<ui-cards>
				{this.cards.map(card => <ui-card>{card ?? 'H'}</ui-card>)}
			</ui-cards>
		</ui-competitor>;
	}
}