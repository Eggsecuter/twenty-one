import { Deck } from "./deck";
import { Player } from "./player";
import { PlayerState } from "./player-state";

export class Round {
	private deck = new Deck();
	private perfectSum = 21;

	private turns = 0;
	private playerOneStarts: boolean;

	private continuosStayCounter = 0;

	private get isPlayerOne() {
		return this.turns % 2 == (this.playerOneStarts ? 0 : 1);
	}

	private get currentPlayer() {
		if (this.isPlayerOne) {
			return this.playerOne;
		} else {
			return this.playerTwo;
		}
	}

	private get bet() {
		return this.index + 1;
	}

	constructor (
		private index: number,
		private players: Player[],
		private playerOne: PlayerState,
		private playerTwo: PlayerState,
		private onConclude: () => void
	) {
		// the starting player switches every round
		this.playerOneStarts = index % 2 == 0;

		// initialize drawn cards
		this.playerOne.reset();
		this.playerTwo.reset();

		for (let repetition = 0; repetition < 4; repetition++) {
			this.draw();
		}
	}

	stay() {
		this.continuosStayCounter++;

		for (let index = 0; index < this.players.length; index++) {
			this.players[index].send({
				stay: {
					playerOne: this.isPlayerOne
				}
			});
		}

		this.endTurn();
	}

	draw() {
		this.continuosStayCounter = 0;

		if (this.currentPlayer.sum > this.perfectSum) {
			this.stay();
			return;
		}

		const card = this.deck.draw();
		this.currentPlayer.draw(card);

		for (let index = 0; index < this.players.length; index++) {
			if (this.turns > 4 || index == (this.isPlayerOne ? 0 : 1)) {
				this.players[index].send({
					draw: {
						playerOne: this.isPlayerOne,
						card: card
					}
				});
			} else {
				this.players[index].send({
					hiddenDraw: {
						playerOne: this.isPlayerOne
					}
				});
			}
		}

		this.endTurn();
	}

	private endTurn() {
		this.turns++;

		// both players stayed in succession
		if (this.continuosStayCounter == 2) {
			this.conclude();
		}
	}

	private conclude() {
		// tie if both overshot or have the same sum
		if (this.playerOne.sum <= this.perfectSum || this.playerTwo.sum <= this.perfectSum) {
			if (this.playerOne.sum > this.perfectSum) {
				this.playerTwo.takeDamage(this.bet);
			} else if (this.playerTwo.sum > this.perfectSum) {
				this.playerOne.takeDamage(this.bet);
			} else if (this.playerOne.sum > this.playerTwo.sum) {
				this.playerTwo.takeDamage(this.bet);
			} else if (this.playerTwo.sum > this.playerOne.sum) {
				this.playerOne.takeDamage(this.bet);
			}
		}

		this.onConclude();
	}
}