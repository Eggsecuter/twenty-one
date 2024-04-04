import { Player } from "./player"

export class PlayerState {
	private cards: number[];
	private health: number;

	constructor (
		public participant: () => Player
	) {
		this.reset();
	}

	reset() {
		this.cards = [];
		this.health = 5;
	}

	addCard(card: number) {
		this.cards.push(card);
	}
}