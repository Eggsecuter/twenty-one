import { competitorStartHealth } from "../../shared/game-settings";
import { Player } from "./player";

export class Competitor {
	public health: number = competitorStartHealth;
	public cards: number[] = [];

	get sum() {
		return this.cards.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
	}

	get dead() {
		return this.health <= 0;
	}

	constructor (
		public player: Player
	) {}

	reset() {
		this.cards = [];
	}

	draw(card: number) {
		this.cards.push(card);
	}

	takeDamage(damage: number) {
		this.health -= damage;

		if (this.health <= 0) {
			this.health = 0;
		}
	}
}