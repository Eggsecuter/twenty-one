import { defaultBet } from "./constants";
import { Player } from "./player";
import { TrumpCard } from "./trump-card";

export class Competitor {
	storedTrumpCards: TrumpCard[] = [];

	bet: number;
	cards: number[];
	playedTrumpCards: TrumpCard[];

	get sum() {
		return this.cards.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
	}

	get dead() {
		return this.health <= 0;
	}

	constructor (
		public readonly player: Player,
		private health: number
	) {
		this.reset();
	}
	
	reset() {
		this.bet = defaultBet;
		this.cards = [];
		this.playedTrumpCards = [];
	}

	takeDamage() {
		this.health -= this.bet;
	}
}
