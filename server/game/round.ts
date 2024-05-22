import { Deck } from "./deck";
import { Player } from "./player";
import { Competitor } from "./competitor";
import { defaultBet, defaultPerfectSum, initialCardCount, resultShowDurationSeconds } from "../../shared/game-settings";
import { Game } from "./game";
import { ServerMessage } from "../../shared/messages";

export class Round {
	private iteration: number;

	private deck: Deck;
	private turns: number;
	private continuosStayCounter: number;

	private get currentCompetitor() {
		// the starting competitor switches every round
		return this.turns % 2 == this.iteration % 2 ? this.competitorOne : this.competitorTwo;
	}

	private get bet() {
		// changes depending on trump cards
		return defaultBet;
	}

	private get perfectSum() {
		// changes depending on trump cards
		return defaultPerfectSum;
	}

	constructor (
		private players: Player[],
		private competitorOne: Competitor,
		private competitorTwo: Competitor,
		private onEnd: (winner: Player) => void
	) {
		this.initialize();
	}

	stay(player: Player) {
		if (player.id != this.currentCompetitor.player.id) {
			return;
		}

		const currentPlayerId = player.id;
		this.continuosStayCounter++;

		const next = this.endTurn();

		this.broadcast(() => ({
			stay: {
				id: currentPlayerId,
				next: {
					id: next
				}
			}
		}));
	}

	draw(player: Player) {
		if (player.id != this.currentCompetitor.player.id) {
			return;
		}

		this.continuosStayCounter = 0;

		const currentPlayerId = player.id;
		const card = this.deck.draw();
		this.currentCompetitor.draw(card);

		const next = this.endTurn();

		// initial cards are hidden from other players
		this.broadcast(player => ({
			draw: {
				id: currentPlayerId,
				card: this.turns > initialCardCount || player.id == currentPlayerId ? card : null,
				next: {
					id: next
				}
			}
		}));
	}

	private async initialize() {
		this.deck = new Deck();
		this.turns = 0;
		this.continuosStayCounter = 0;

		if (isNaN(this.iteration)) {
			this.iteration = 0;
		} else {
			this.iteration++;
		}

		// initialize drawn cards
		this.competitorOne.reset();
		this.competitorTwo.reset();

		for (let repetition = 0; repetition < initialCardCount; repetition++) {
			this.draw(this.currentCompetitor.player);
			await Game.sleep(0.5);
		}
	}

	// returns next competitor action is needed
	// while initializing or if complete no action is needed and null is returned
	private endTurn() {
		this.turns++;

		// no more cards left or both players stayed in succession ends the round
		if (this.deck.empty || this.continuosStayCounter == 2) {
			this.conclude();
		} else if (this.turns > initialCardCount - 1) {
			return this.currentCompetitor.player.id;
		}

		return null;
	}

	private async conclude() {
		let winner: Player;

		// tie if both overshot or have the same sum
		if (this.competitorOne.sum <= this.perfectSum || this.competitorTwo.sum <= this.perfectSum) {
			if (this.competitorOne.sum > this.perfectSum) {
				this.competitorOne.takeDamage(this.bet);
				winner = this.competitorTwo.player;
			} else if (this.competitorTwo.sum > this.perfectSum) {
				this.competitorTwo.takeDamage(this.bet);
				winner = this.competitorOne.player;
			} else if (this.competitorOne.sum > this.competitorTwo.sum) {
				this.competitorTwo.takeDamage(this.bet);
				winner = this.competitorOne.player;
			} else if (this.competitorTwo.sum > this.competitorOne.sum) {
				this.competitorOne.takeDamage(this.bet);
				winner = this.competitorTwo.player;
			}
		}

		this.broadcast(() => ({
			conclude: {
				competitorOne: {
					id: this.competitorOne.player.id,
					health: this.competitorOne.health,
					cards: this.competitorOne.cards
				},
				competitorTwo: {
					id: this.competitorTwo.player.id,
					health: this.competitorTwo.health,
					cards: this.competitorTwo.cards
				},
				winner: {
					id: winner?.id
				}
			}
		}));

		await Game.sleep(resultShowDurationSeconds);

		if (this.competitorOne.dead) {
			this.onEnd(this.competitorTwo.player);
		} else if (this.competitorTwo.dead) {
			this.onEnd(this.competitorOne.player);
		} else {
			this.initialize();
		}
	}

	private broadcast(message: (player: Player) => ServerMessage) {
		for (const player of this.players) {
			player.send(message(player));
		}
	}
}