export class Deck {
	private availableCards: number[];

	get empty() {
		return !this.availableCards.length;
	}

	constructor() {
		this.availableCards = Array(11).fill(0).map((_, index) => index + 1);
	}

	draw() {
		if (this.empty) {
			return;
		}

		// draw from random index
		return this.availableCards.splice(Math.floor(Math.random() * this.availableCards.length), 1)[0];
	}

	insert(card: number) {
		if (this.availableCards.includes(card)) {
			return;
		}

		this.availableCards.push(card);
	}
}
