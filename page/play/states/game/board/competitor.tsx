import { Component } from "@acryps/page";
import { defaultPerfectSum } from "../../../../../shared/constants";
import { GameComponent } from "..";
import { TrumpCard } from "../../../../../shared/trump-card";
import { SocketMessage } from "../../../../../shared/messages/message";
import { ClientDrawMessage, ClientStayMessage } from "../../../../../shared/messages/client";
import { Application } from "../../../..";
import { activateTrumpCardAnimationDuration, dealCardAnimationDuration } from "../board/index.style";
import { TrumpCardDialogComponent } from "./trump-card-dialog";
import { AnonymousTrumpCard } from "../../../../../shared/messages/server";
import { Observable } from "@acryps/page-observable";

export class BoardCompetitorComponent extends Component {
	private isLocalPlayer = false;
	private actionRequired = false;

	private cardsElement: HTMLElement;
	private trumpCardsElement: HTMLElement;
	private trumpCardDialog: TrumpCardDialogComponent;

	private sumText = new Observable<string>('0');

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

		let sumText = `${this.competitor.sum}`;

		if (this.competitor.cards.length && this.competitor.cards[0] == null) {
			sumText += ' + ?';
		}

		this.sumText.emit(sumText);

		await Application.waitForSeconds(+dealCardAnimationDuration.value);
	}

	async dealTrumpCard(card: AnonymousTrumpCard) {
		if (card == null) {
			return;
		}

		const trumpCardElement = this.renderDealTrumpCard();
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
		if (this.isLocalPlayer) {
			const trumpCardIndex = this.competitor.storedTrumpCards.findIndex(other => other.name == trumpCard.name);
			this.competitor.storedTrumpCards.splice(trumpCardIndex, 1);
		}

		this.competitor.playedTrumpCards.push(trumpCard);

		this.trumpCardsElement.appendChild(
			this.renderActivateTrumpCard(trumpCard)
		);

		await Application.waitForSeconds(+activateTrumpCardAnimationDuration.value);
		await this.trumpCardDialog.present(trumpCard, this.competitor.player);
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
		return <ui-competitor-board>
			{this.trumpCardsElement = <ui-trump-cards style='perspective: 800px'>{this.competitor.playedTrumpCards.map(card => this.renderTrumpCard(card))}</ui-trump-cards>}
			{this.cardsElement = <ui-cards>{this.competitor.cards.map(card => this.renderCard(card))}</ui-cards>}
			<ui-sum>{this.sumText.map(value => value)} / {defaultPerfectSum}</ui-sum>

			{this.isLocalPlayer && <ui-actions ui-active={this.actionRequired}>
				<ui-action ui-click={() => this.sendAction(new ClientDrawMessage())}>Draw</ui-action>
				<ui-action ui-click={() => this.sendAction(new ClientStayMessage())}>Stay</ui-action>
			</ui-actions>}

			{this.trumpCardDialog = new TrumpCardDialogComponent()}
		</ui-competitor-board>;
	}

	renderDealTrumpCard() {
		const element = this.renderDealCard(null);
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

	renderActivateTrumpCard(card: TrumpCard) {
		const element = this.renderTrumpCard(card);
		element.setAttribute('ui-activate', '');

		return element;
	}

	renderTrumpCard(card: TrumpCard): HTMLElement {
		return <ui-trump-card>
			<img src={`/assets/trump-cards/${card.icon}.webp`} />
		</ui-trump-card>;
	}

	private sendAction(message: SocketMessage) {
		this.actionRequired = false;
		GameComponent.context.playComponent.socket.send(message);

		this.update();
	}
}
