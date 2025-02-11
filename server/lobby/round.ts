import { BroadcastMessage } from ".";
import { defaultPerfectSum } from "../../shared/constants";
import { ServerBoardResultMessage, ServerDrawMessage, ServerInitialBoardMessage, ServerStayMessage, ServerUseTrumpCardMessage } from "../../shared/messages/server";
import { Player } from "../../shared/player";
import { Deck } from "./deck";
import { Competitor } from "../../shared/competitor";
import { TrumpCardPicker } from "./trump-card-picker";

export class Round {
	private competitors: Competitor[];
	private currentCompetitorIndex: 0 | 1;
	
	private perfectSum: number;
	private deck: Deck;
	private stayCounter: number;

	get current() {
		return this.competitors[this.currentCompetitorIndex];
	}

	get opponent() {
		return this.competitors[1 - this.currentCompetitorIndex];
	}

	constructor(
		startHealth: number,
		firstCompetitor: Player,
		secondCompetitor: Player,
		private broadcast: (message: BroadcastMessage) => void,
		private onconclude: (winner: Competitor) => void
	) {
		this.competitors = [
			new Competitor(firstCompetitor.id, startHealth),
			new Competitor(secondCompetitor.id, startHealth)
		];

		this.initializeBoard();
	}

	stay(player: Player) {
		if (player.id != this.current.id) {
			return;
		}

		this.stayCounter++;
		this.broadcast(new ServerStayMessage());
		
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
		this.broadcast(new ServerDrawMessage(card, trumpCard));

		this.endTurn();
	}

	useTrumpCard(player: Player, trumpCardIndex: number) {
		if (player.id != this.current.id) {
			return;
		}

		// allow competitors to react to newly played trump cards
		// afterwards: drawing sets it to 0, staying increments it (by one) to 1
		this.stayCounter = 0;

		const trumpCard = this.current.storedTrumpCards[trumpCardIndex];

		if (trumpCard) {
			this.current.storedTrumpCards.splice(trumpCardIndex, 1);

			this.current.playedTrumpCards.push(trumpCard);
			trumpCard.activate();

			this.broadcast(new ServerUseTrumpCardMessage(trumpCard));
		}
	}

	private initializeBoard() {
		// who begins is random
		this.currentCompetitorIndex = Math.random() < 0.5 ? 0 : 1;

		this.perfectSum = defaultPerfectSum;
		this.stayCounter = 0;
		this.deck = new Deck();

		this.current.reset();
		this.opponent.reset();

		// draw initial hidden card for each competitor
		this.current.cards.push(this.deck.draw());
		this.opponent.cards.push(this.deck.draw());

		// at the start of each new board a trump card gets picked
		const currentDrawnTrumpCard = TrumpCardPicker.drawCertain(this.current);
		const opponentDrawnTrumpCard = TrumpCardPicker.drawCertain(this.opponent);

		// conditional broadcast as the hidden card only gets shown to the competitor themselves
		this.broadcast(connection => {
			let hiddenCard: number;
			
			if (connection.player.id == this.current.id) {
				hiddenCard = this.current.cards[0];
			}
			
			if (connection.player.id == this.opponent.id) {
				hiddenCard = this.opponent.cards[0];
			}
			
			return new ServerInitialBoardMessage(
				this.current.id,
				currentDrawnTrumpCard,
				opponentDrawnTrumpCard,
				hiddenCard
			);
		});
	}

	private endTurn() {
		if (this.stayCounter >= 2 || this.deck.empty) {
			let winner: Competitor;

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

			winner?.takeDamage();

			this.broadcast(new ServerBoardResultMessage(winner?.id, {
				id: this.current.id,
				cards: this.current.cards
			}, {
				id: this.opponent.id,
				cards: this.opponent.cards
			}))

			if (this.current.dead) {
				this.onconclude(this.opponent);
			} else if (this.opponent.dead) {
				this.onconclude(this.current);
			} else {
				this.initializeBoard();
			}
		} else {
			// swap after each turn
			this.currentCompetitorIndex = this.currentCompetitorIndex ? 0 : 1;
		}
	}
}
