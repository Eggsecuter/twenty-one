import { defaultBet } from "./constants";
import { Player } from "./player";
import { TrumpCard } from "./trump-card";

export class Competitor {
	storedTrumpCards: TrumpCard[];

	cards: number[];
	playedTrumpCards: TrumpCard[];

	get sum() {
		return this.cards.reduce((accumulator, currentValue) => accumulator + (currentValue ?? 0), 0);
	}

	get dead() {
		return this.health <= 0;
	}

	constructor (
		public readonly player: Player,
		public health: number
	) {
		this.storedTrumpCards = [];

		this.resetBoard();
	}

	resetBoard() {
		this.cards = [];
		this.playedTrumpCards = [];
	}

	takeDamage() {
		this.health -= defaultBet;
	}
}
