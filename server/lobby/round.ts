import { BroadcastMessage } from ".";
import { defaultPerfectSum } from "../../shared/constants";
import { AnonymousTrumpCard, ServerBoardResultMessage, ServerDrawMessage, ServerInitialBoardMessage, ServerStayMessage, ServerUseTrumpCardMessage } from "../../shared/messages/server";
import { Player } from "../../shared/player";
import { Deck } from "./deck";
import { Competitor } from "../../shared/competitor";
import { TrumpCardPicker } from "./trump-card-picker";
import { PlayerConnection } from "./player-connection";
import { TrumpCardEffectHandler } from "../../shared/trump-card";

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

	get roundOver() {
		return this.stayCounter >= 2 || this.deck.empty;
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

		this.currentCompetitorIndex = Math.random() < 0.5 ? 0 : 1;
		this.initializeBoard();
	}

	stay(player: Player) {
		if (player.id != this.current.player.id) {
			return;
		}

		this.stayCounter++;

		this.broadcast(new ServerStayMessage(this.roundOver));
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

		this.broadcast(connection => {
			let anonymousTrumpCard = null;

			if (trumpCard) {
				anonymousTrumpCard = connection.player == player ? trumpCard : 'hidden';
			}

			return new ServerDrawMessage(this.roundOver, card, anonymousTrumpCard);
		});

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

		if (!trumpCard) {
			return;
		}

		this.current.storedTrumpCards.splice(trumpCardIndex, 1);
		const message = new ServerUseTrumpCardMessage(trumpCard);

		const effectHandler = new TrumpCardEffectHandler(
			(card: number | 'best', opponent: boolean) => {
				const competitor = opponent ? this.opponent : this.current;
				const drawnCard = card == 'best' ? this.deck.drawBest(this.perfectSum - competitor.sum) : this.deck.drawSpecific(card);

				if (drawnCard) {
					competitor.cards.push(drawnCard);
					message.drawnCard = drawnCard;
				}
			},
			(opponent: boolean) => {
				const competitor = opponent ? this.opponent : this.current;

				// can't remove first (face down) card
				if (competitor.cards.length <= 1) {
					return;
				}

				const lastCard = competitor.cards.splice(-1, 1)[0];
				this.deck.putBack(lastCard);
			},
			() => {
				// can't exchange first (face down) cards
				if (this.current.cards.length <= 1 || this.opponent.cards.length <= 1) {
					return;
				}

				const swap = this.current.cards.splice(-1, 1)[0];
				this.current.cards.push(this.opponent.cards.splice(-1, 1)[0]);
				this.opponent.cards.push(swap);
			},
			(count: number) => {
				const drawnTrumpCards = Array(count).fill('').map(() => TrumpCardPicker.forceDraw());

				this.current.storedTrumpCards.push(...drawnTrumpCards);
				message.drawnTrumpCards.push(...drawnTrumpCards);
			},
			(count: number) => {
				while (count > 0) {
					const index = Math.floor(Math.random() * this.current.storedTrumpCards.length);

					message.removedTrumpCards.push(
						this.current.storedTrumpCards.splice(index, 1)[0]
					);

					count--;
				}
			},
			(count: number | 'all') => {
				if (count == 'all') {
					this.opponent.activeTrumpCards = [];
				} else {
					this.opponent.activeTrumpCards = this.opponent.activeTrumpCards.slice(0, -count);
				}
			}
		);

		trumpCard.executeEffect(effectHandler);

		if (trumpCard.permanent) {
			this.current.activeTrumpCards.push(trumpCard);
		}

		this.broadcast(connection => {
			if (connection.player == player) {
				return message;
			}

			const clone: ServerUseTrumpCardMessage = JSON.parse(JSON.stringify(message));
			clone.drawnTrumpCards.map(() => 'hidden' as AnonymousTrumpCard);

			return clone;
		});
	}

	private initializeBoard() {
		this.perfectSum = defaultPerfectSum;
		this.stayCounter = 0;
		this.deck = new Deck();

		this.current.resetBoard();
		this.opponent.resetBoard();

		// draw initial cards for each competitor
		this.current.cards.push(this.deck.draw(), this.deck.draw());
		this.opponent.cards.push(this.deck.draw(), this.deck.draw());

		// at the start of each new board a trump card gets picked
		this.current.storedTrumpCards.push(TrumpCardPicker.drawCertain(this.current.storedTrumpCards.length));
		this.opponent.storedTrumpCards.push(TrumpCardPicker.drawCertain(this.opponent.storedTrumpCards.length));

		// conditional broadcast as the hidden card only gets shown to the competitor themselves
		this.broadcast(connection => {
			const createInitialBoard = (connection: PlayerConnection, competitor: Competitor) => {
				const anonymous = connection.player != competitor.player;

				return {
					id: competitor.player.id,
					trumpCard: (anonymous ? 'hidden' : competitor.storedTrumpCards.at(-1)) as AnonymousTrumpCard,
					hiddenCard: anonymous ? null : competitor.cards[0],
					shownCard: competitor.cards[1]
				}
			}

			return new ServerInitialBoardMessage(createInitialBoard(connection, this.current), createInitialBoard(connection, this.opponent));
		});
	}

	private endTurn() {
		if (!this.roundOver) {
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
