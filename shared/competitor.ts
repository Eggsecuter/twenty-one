import { defaultBet } from "./constants";
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
		public readonly id: string,
		private health: number
	) {}
	
	reset() {
		this.bet = defaultBet;
		this.cards = [];
		this.playedTrumpCards = [];
	}

	takeDamage() {
		this.health -= this.bet;
	}
}
