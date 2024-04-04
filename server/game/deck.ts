export class Deck {
	private availableCards: number[];

	constructor() {
		this.availableCards = Array(11).fill(0).map((_, index) => index + 1);
	}

	draw() {
		if (!this.availableCards.length) {
			return;
		}

		return this.availableCards.splice(Math.floor(Math.random() * this.availableCards.length), 1)[0];
	}

	insert(card: number) {
		if (this.availableCards.includes(card)) {
			console.warn(`Card ${card} is already in deck`);
			return;
		}

		// plus one because it can be inserted after the last element
		const position = Math.floor(Math.random() * (this.availableCards.length + 1));
		this.availableCards = [...this.availableCards.slice(0, position), card, ...this.availableCards.slice(position)];
	}
}