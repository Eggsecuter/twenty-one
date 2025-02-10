import { defaultPerfectSum } from "../../shared/constants";
import { SocketMessage } from "../../shared/messages/message";
import { Player } from "../../shared/player";
import { Deck } from "./deck";
import { PlayerState } from "./player-state";
import { TrumpCardPicker } from "./trump-card-picker";

export class Round {
	private playerStates: PlayerState[];
	private currentPlayerIndex: 0 | 1;
	
	private perfectSum: number;
	private deck: Deck;
	private stayCounter: number;

	get current() {
		return this.playerStates[this.currentPlayerIndex];
	}

	get opponent() {
		return this.playerStates[1 - this.currentPlayerIndex];
	}

	constructor(
		startHealth: number,
		firstCompetitor: Player,
		secondCompetitor: Player,
		private broadcast: (message: SocketMessage) => void
	) {
		this.playerStates = [
			new PlayerState(firstCompetitor.id, startHealth),
			new PlayerState(secondCompetitor.id, startHealth)
		];

		this.initializeBoard();
	}

	stay(player: Player) {
		if (player.id != this.current.id) {
			return;
		}

		this.stayCounter++;
		
		// todo broadcast
		
		this.endTurn();
	}

	draw(player: Player) {
		if (player.id != this.current.id) {
			return;
		}

		this.stayCounter = 0;

		const card = this.deck.draw();
		this.current.cards.push(card);

		const trumpCard = TrumpCardPicker.drawByChance(this.current);

		// todo broadcast

		this.endTurn();
	}

	useTrumpCard(player: Player, trumpCardIndex: number) {
		if (player.id != this.current.id) {
			return;
		}

		// allow competitors to react to newly played trump cards
		// afterwards: drawing sets it to 0, staying increments it to 0
		this.stayCounter = -1;

		const trumpCard = this.current.storedTrumpCards[trumpCardIndex];

		if (trumpCard) {
			this.current.storedTrumpCards.splice(trumpCardIndex, 1);

			this.current.playedTrumpCards.push(trumpCard);
			trumpCard.activate();

			// todo broadcast
		}
	}

	private initializeBoard() {
		// who begins is random
		this.currentPlayerIndex = Math.random() < 0.5 ? 0 : 1;

		this.perfectSum = defaultPerfectSum;
		this.stayCounter = 0;
		this.deck = new Deck();

		for (const playerState of this.playerStates) {
			playerState.reset();

			// draw initial hidden card for each competitor
			playerState.cards.push(this.deck.draw());

			// at the start of each new board a trump card gets picked
			const trumpCard = TrumpCardPicker.drawCertain(playerState);
		}

		// todo broadcast
	}
	
	private endTurn() {
		if (this.stayCounter >= 2 || this.deck.empty) {
			let winner: PlayerState;

			// tie if both overshot or have the same sum
			if (this.current.sum <= this.perfectSum || this.opponent.sum <= this.perfectSum) {
				if (this.current.sum > this.perfectSum) {
					winner = this.opponent;
				} else if (this.opponent.sum > this.perfectSum) {
					winner = this.current;
				} else if (this.current.sum > this.opponent.sum) {
					winner = this.current;
				} else if (this.opponent.sum > this.current.sum) {
					winner = this.opponent;
				}
			}

			// todo send winner
		} else {
			// swap after each turn
			this.currentPlayerIndex = this.currentPlayerIndex ? 0 : 1;
		}
	}
}
