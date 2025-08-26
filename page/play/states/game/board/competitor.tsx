import { Component } from "@acryps/page";
import { defaultPerfectSum } from "../../../../../shared/constants";
import { GameComponent } from "..";
import { TrumpCard } from "../../../../../shared/trump-card";
import { SocketMessage } from "../../../../../shared/messages/message";
import { ClientDrawMessage, ClientStayMessage } from "../../../../../shared/messages/client";
import { Application } from "../../../..";
import { dealCardAnimationDuration } from "../board/index.style";
import { TrumpCardDialogComponent } from "./trump-card-dialog";
import { AnonymousTrumpCard } from "../../../../../shared/messages/server";

export class BoardCompetitorComponent extends Component {
	private isLocalPlayer = false;
	private actionRequired = false;

	private cardsElement: HTMLElement;
	private trumpCardDialog: TrumpCardDialogComponent;

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

		this.cardsElement.appendChild(
			this.renderDealCard(card)
		);

		await Application.waitForSeconds(+dealCardAnimationDuration.value);
	}

	async dealTrumpCard(card: AnonymousTrumpCard) {
		if (card == null) {
			return;
		}

		const trumpCardElement = this.renderDealTrumpCard(null);
		this.cardsElement.appendChild(trumpCardElement);

		// wait for animation plus a little extra to present backside
		await Application.waitForSeconds(+dealCardAnimationDuration.value + 0.5);

		if (card != 'hidden') {
			this.competitor.storedTrumpCards.push(card);
			await this.trumpCardDialog.present(card);
		}

		trumpCardElement.remove();
	}

	async activateTrumpCard(trumpCard: TrumpCard) {
		const trumpCardIndex = this.competitor.storedTrumpCards.findIndex(other => other.name == trumpCard.name);

		if (!trumpCardIndex) {
			return;
		}

		// TODO played trump cards
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
			{this.cardsElement = <ui-cards>{this.competitor.cards.map(card => this.renderCard(card))}</ui-cards>}
			<ui-sum>{sumText} / {defaultPerfectSum}</ui-sum>

			{this.isLocalPlayer && <ui-actions ui-active={this.actionRequired}>
				<ui-action ui-click={() => this.sendAction(new ClientDrawMessage())}>Draw</ui-action>
				<ui-action ui-click={() => this.sendAction(new ClientStayMessage())}>Stay</ui-action>
			</ui-actions>}

			{this.trumpCardDialog = new TrumpCardDialogComponent()}
		</ui-competitor-board>;
	}

	renderDealTrumpCard(card: number) {
		const element = this.renderDealCard(card);
		element.setAttribute('ui-trump-card', '');

		return element;
	}

	renderDealCard(card: number) {
		const element = this.renderCard(card);
		element.setAttribute('ui-deal', '');

		return element;
	}

	renderCard(card: number): HTMLElement {
		return <ui-card>
			<img src={`/assets/cards/${card ?? 'back'}.png`} />
		</ui-card>;
	}

	private sendAction(message: SocketMessage) {
		this.actionRequired = false;
		GameComponent.context.playComponent.socket.send(message);

		this.update();
	}
}
