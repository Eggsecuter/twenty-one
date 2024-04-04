import { Deck } from "./deck";
import { PlayerState } from "./player-state";

export class Round {
	private deck: Deck;

	constructor (
		public playerOne: PlayerState,
		public playerTwo: PlayerState
	) {}

	start() {
		this.deck = new Deck();

		this.playerOne.addCard(this.deck.draw());
		this.playerTwo.addCard(this.deck.draw());
		this.playerOne.addCard(this.deck.draw());
		this.playerTwo.addCard(this.deck.draw());
	}
}