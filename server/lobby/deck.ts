export class Deck {
	private cards: boolean[];

	get empty() {
		return !this.cards.some(card => card);
	}

	constructor() {
		this.cards = Array(11).fill(0).map(() => true);
	}

	draw() {
		const availableCount = this.cards.filter(card => card).length;

		if (availableCount == 0) {
			return;
		}

		// draw from random index
		let target = Math.floor(Math.random() * availableCount);

		for (let index = 0; index < this.cards.length; index++) {
			if (this.cards[index]) {
				if (target == 0) {
					this.cards[target] = false;
					return index;
				}

				target--;
			}
		}
	}

	drawSpecific(card: number) {
		if (this.cards[card]) {
			this.cards[card] = false;

			return card;
		}
	}

	drawBest(differenceToPerfectSum: number) {
		if (this.empty) {
			return;
		}

		let bestIndex = -1;

		if (differenceToPerfectSum <= 0) {
			// return smallest card
			bestIndex = this.cards.findIndex(card => card);
		} else {
			const maxIndex = Math.min(this.cards.length - 1, differenceToPerfectSum);

			for (let index = maxIndex; index >= 0; index--) {
				if (this.cards[index]) {
					bestIndex = index;
					break;
				}
			}
		}

		this.cards[bestIndex] = false;
		return bestIndex;
	}

	putBack(card: number) {
		this.cards[card] = true;
	}
}
