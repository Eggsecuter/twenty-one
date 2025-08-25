import { Component } from "@acryps/page";
import { defaultPerfectSum } from "../../../../../shared/constants";
import { GameComponent } from "..";
import { TrumpCard } from "../../../../../shared/trump-card";
import { SocketMessage } from "../../../../../shared/messages/message";
import { ClientDrawMessage, ClientStayMessage } from "../../../../../shared/messages/client";
import { Application } from "../../../..";
import { dealCardAnimationDuration } from "../index.style";

export class BoardCompetitorComponent extends Component {
	private isLocalPlayer = false;
	private actionRequired = false;

	get competitor() {
		return GameComponent.context.competitorContexts[this.competitorContextIndex].competitor;
	}

	constructor (
		private competitorContextIndex: number
	) {
		super();

		GameComponent.context.competitorContexts[this.competitorContextIndex].boardComponent = this;
		this.isLocalPlayer = this.competitor.player.id == GameComponent.context.playComponent.player.id;
	}

	async callForAction() {
		this.actionRequired = true;
		this.update();
	}

	async dealCard(card: number) {
		this.competitor.cards.push(card);
		this.update();
		await Application.waitForSeconds(+dealCardAnimationDuration.value);
	}

	async dealTrumpCard(card: TrumpCard) {
		if (!card) {
			return;
		}

		this.competitor.storedTrumpCards.push(card);
	}

	async activateTrumpCard(trumpCardIndex: number) {
		const trumpCard = this.competitor.storedTrumpCards[trumpCardIndex];

		if (!trumpCard) {
			return;
		}

		this.competitor.storedTrumpCards.splice(trumpCardIndex, 1);
		this.competitor.playedTrumpCards.push(trumpCard);
	}

	async reveal(cards: number[]) {
		this.competitor.cards = cards;
		this.update();
	}

	async resetBoard() {
		this.competitor.resetBoard();
		this.update();
	}

	async resetStoredTrumpCards() {
		this.competitor.storedTrumpCards = [];
		this.update();
	}

	render() {
		let sumText = `${this.competitor.sum}`;

		if (this.competitor.cards.length && this.competitor.cards[0] == null) {
			sumText += ' + ?';
		}

		return <ui-competitor-board>
			<ui-cards>{this.competitor.cards.map(card =>
				<ui-card>
					<img src={`/assets/cards/${card ?? 'back'}.png`} />
				</ui-card>
			)}</ui-cards>

			<ui-sum>{sumText} / {defaultPerfectSum}</ui-sum>

			<ui-actions ui-active={this.isLocalPlayer && this.actionRequired}>
				<ui-action ui-click={() => this.sendAction(new ClientDrawMessage())}>Draw</ui-action>
				<ui-action ui-click={() => this.sendAction(new ClientStayMessage())}>Stay</ui-action>
			</ui-actions>
		</ui-competitor-board>;
	}

	private sendAction(message: SocketMessage) {
		this.actionRequired = false;
		GameComponent.context.playComponent.socket.send(message);

		this.update();
	}
}
