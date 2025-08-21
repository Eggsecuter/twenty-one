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
			new Competitor(firstCompetitor, startHealth),
			new Competitor(secondCompetitor, startHealth)
		];

		this.initializeBoard();
	}

	stay(player: Player) {
		if (player.id != this.current.player.id) {
			return;
		}

		this.stayCounter++;
		this.broadcast(new ServerStayMessage());

		this.endTurn();
	}

	draw(player: Player) {
		if (player.id != this.current.player.id) {
			return;
		}

		this.stayCounter = 0;

		const card = this.deck.draw();
		this.current.cards.push(card);

		const trumpCard = TrumpCardPicker.drawByChance(this.current.storedTrumpCards.length);
		this.current.storedTrumpCards.push(trumpCard);

		this.broadcast(new ServerDrawMessage(card, trumpCard));
		this.endTurn();
	}

	useTrumpCard(player: Player, trumpCardIndex: number) {
		if (player.id != this.current.player.id) {
			return;
		}

		// allow competitors to react to newly played trump cards
		// afterwards: drawing sets it to 0, staying increments it (by one) to 1
		this.stayCounter = 0;

		const trumpCard = this.current.storedTrumpCards[trumpCardIndex];

		if (trumpCard) {
			this.current.storedTrumpCards.splice(trumpCardIndex, 1);

			this.current.playedTrumpCards.push(trumpCard);
			// todo trump card effect

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

		// draw initial cards for each competitor
		this.current.cards.push(this.deck.draw(), this.deck.draw());
		this.opponent.cards.push(this.deck.draw(), this.deck.draw());

		// at the start of each new board a trump card gets picked
		const currentTrumpCard = TrumpCardPicker.drawCertain(this.current.storedTrumpCards.length);
		this.current.storedTrumpCards.push(currentTrumpCard);
		const opponentTrumpCard = TrumpCardPicker.drawCertain(this.opponent.storedTrumpCards.length);
		this.opponent.storedTrumpCards.push(opponentTrumpCard);

		// conditional broadcast as the hidden card only gets shown to the competitor themselves
		this.broadcast(connection => new ServerInitialBoardMessage({
			id: this.current.player.id,
			trumpCard: currentTrumpCard,
			hiddenCard: connection.player.id == this.current.player.id ? this.current.cards[0] : null,
			shownCard: this.current.cards[1]
		}, {
			id: this.opponent.player.id,
			trumpCard: opponentTrumpCard,
			hiddenCard: connection.player.id == this.opponent.player.id ? this.opponent.cards[0] : null,
			shownCard: this.opponent.cards[1]
		}));
	}

	private endTurn() {
		if (this.stayCounter < 2 && !this.deck.empty) {
			// swap beginning player after each turn
			this.currentCompetitorIndex = this.currentCompetitorIndex ? 0 : 1;

			return;
		}

		const winner = this.getWinner();

		if (winner) {
			const loser = winner == this.current ? this.opponent : this.current;
			loser.takeDamage();
		}

		this.broadcast(new ServerBoardResultMessage(
			{ id: this.current.player.id, cards: this.current.cards },
			{ id: this.opponent.player.id, cards: this.opponent.cards },
			winner?.player
		));

		// end round if either player is dead else play new hands
		if (this.current.dead) {
			this.onconclude(this.opponent);
		} else if (this.opponent.dead) {
			this.onconclude(this.current);
		} else {
			this.initializeBoard();
		}
	}

	private getWinner() {
		// tie -> both overshot
		if (this.current.sum > this.perfectSum && this.opponent.sum > this.perfectSum) {
			return;
		}

		// tie -> same sum
		if (this.current.sum == this.opponent.sum) {
			return;
		}

		if (this.current.sum <= this.perfectSum && (this.current.sum > this.opponent.sum || this.opponent.sum > this.perfectSum)) {
			return this.current;
		} else {
			return this.opponent;
		}
	}
}
