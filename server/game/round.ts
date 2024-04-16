import { Deck } from "./deck";
import { Player } from "./player";
import { Competitor } from "./competitor";
import { defaultPerfectSum, initialCardCount } from "../../shared/game-settings";
import { Game } from "./game";
import { ServerMessage } from "../../shared/messages";

export class Round {
	private deck = new Deck();
	private perfectSum = defaultPerfectSum;

	private turns = 0;
	private continuosStayCounter = 0;

	private get currentCompetitor() {
		// the starting competitor switches every round
		return this.turns % 2 == this.index % 2 ? this.competitorOne : this.competitorTwo;
	}

	private get bet() {
		return this.index + 1;
	}

	constructor (
		private index: number,
		private players: Player[],
		private competitorOne: Competitor,
		private competitorTwo: Competitor,
		private onConclude: () => void
	) {
		// initialize drawn cards
		this.competitorOne.reset();
		this.competitorTwo.reset();

		const initialize = async () => {
			for (let repetition = 0; repetition < initialCardCount; repetition++) {
				this.draw(this.currentCompetitor.player);
				await Game.sleep(0.5);
			}
		}

		initialize();
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

	private conclude() {
		// tie if both overshot or have the same sum
		if (this.competitorOne.sum <= this.perfectSum || this.competitorTwo.sum <= this.perfectSum) {
			if (this.competitorOne.sum > this.perfectSum) {
				this.competitorTwo.takeDamage(this.bet);
			} else if (this.competitorTwo.sum > this.perfectSum) {
				this.competitorOne.takeDamage(this.bet);
			} else if (this.competitorOne.sum > this.competitorTwo.sum) {
				this.competitorTwo.takeDamage(this.bet);
			} else if (this.competitorTwo.sum > this.competitorOne.sum) {
				this.competitorOne.takeDamage(this.bet);
			}
		}

		this.onConclude();
	}

	private broadcast(message: (player: Player) => ServerMessage) {
		for (const player of this.players) {
			player.send(message(player));
		}
	}
}