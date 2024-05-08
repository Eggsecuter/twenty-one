import { Component } from "@acryps/page";
import { competitorStartHealth } from "../../shared/game-settings";
import { BoardComponent } from "./board";
import { Player } from "./player";
import { PlayerStatsMessage } from "../../shared/messages";

export class CompetitorComponent extends Component {
	declare parent: BoardComponent;

	private health = competitorStartHealth;
	private cards: number[] = [];

	constructor (
		public player: Player
	) {
		super();
	}

	reset() {
		this.cards = [];
	}

	conclude(stats: PlayerStatsMessage) {
		this.health = stats.health;
		this.cards = stats.cards;
	}

	draw(card?: number) {
		this.cards.push(card);
	}

	render() {
		return <ui-competitor ui-active={this.parent.activeCompetitorId == this.player.id}>
			<ui-stats>
				<ui-name>{this.player.name}</ui-name>
				<ui-health>{this.health} ♥</ui-health>
			</ui-stats>

			<ui-cards>
				{this.cards.map(card => <ui-card>{card ?? 'H'}</ui-card>)}
			</ui-cards>
		</ui-competitor>;
	}
}