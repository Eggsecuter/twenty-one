import { Component } from "@acryps/page";
import { competitorStartHealth, defaultBet, defaultPerfectSum } from "../../shared/game-settings";
import { BoardComponent } from "./board";
import { Player } from "./player";
import { PlayerStatsMessage } from "../../shared/messages";

import back from '../assets/cards/back.png';
import one from '../assets/cards/1.png';
import two from '../assets/cards/2.png';
import three from '../assets/cards/3.png';
import four from '../assets/cards/4.png';
import five from '../assets/cards/5.png';
import six from '../assets/cards/6.png';
import seven from '../assets/cards/7.png';
import eight from '../assets/cards/8.png';
import nine from '../assets/cards/9.png';
import ten from '../assets/cards/10.png';
import eleven from '../assets/cards/11.png';

export class CompetitorComponent extends Component {
	declare parent: BoardComponent;

	private readonly cardSources = [
		back, one, two, three, four, five, six, seven, eight, nine, ten, eleven
	];

	private health = competitorStartHealth;
	private cards: number[] = [];

	get bet() {
		return defaultBet;
	}

	constructor (
		public player: Player
	) {
		super();
	}

	reset() {
		this.cards = [];
	}

	restoreHealth() {
		this.health = competitorStartHealth;
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
				<ui-health>{Array(competitorStartHealth).fill('').map((_, index) => this.health > index ? '♥' : '♡')}</ui-health>
			</ui-stats>

			<ui-bet>{this.bet}</ui-bet>

			<ui-placements>
				<ui-cards>
					{this.cards.map(card => <ui-card>
						<img src={card ? this.cardSources[card] : back} />
					</ui-card>)}
				</ui-cards>

				<ui-sum>{this.cards.some(card => card == null) ? '? + ' : ''}{this.cards.reduce((accumulator, currentValue) => accumulator + currentValue ?? 0, 0)} / {defaultPerfectSum}</ui-sum>
			</ui-placements>
		</ui-competitor>;
	}
}