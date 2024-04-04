export class PlayerState {
	private health: number = 5;
	private cards: number[] = [];

	constructor (
		private onDeath: () => void
	) {}

	get sum() {
		return this.cards.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
	}

	reset() {
		this.cards = [];
	}

	draw(card: number) {
		this.cards.push(card);
	}

	takeDamage(damage: number) {
		this.health -= damage;

		if (this.health <= 0) {
			this.health == 0;
			this.onDeath();
		}
	}
}