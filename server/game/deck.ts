import { Player } from "./player";

export class Deck {
	private availableCards: number[];

	constructor() {
		this.availableCards = Array(11).fill(0).map((_, index) => index + 1);
	}

	draw(player: Player) {
		if (!this.availableCards.length) {
			return;
		}

		const card = this.availableCards.splice(Math.floor(Math.random() * this.availableCards.length), 1)[0];
		player.cards.push(card);
	}
}