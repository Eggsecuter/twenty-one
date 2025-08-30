import { Component } from "@acryps/page";
import { defaultPerfectSum } from "../../../../../shared/constants";
import { GameComponent } from "..";
import { TrumpCard } from "../../../../../shared/trump-card";
import { SocketMessage } from "../../../../../shared/messages/message";
import { ClientDrawMessage, ClientStayMessage } from "../../../../../shared/messages/client";
import { Application } from "../../../..";
import { activateTrumpCardDuration, dealCardDuration, flipCardDuration, resetCardDuration } from "../board/index.style";
import { TrumpCardDialogComponent } from "./trump-card-dialog";
import { AnonymousTrumpCard } from "../../../../../shared/messages/server";
import { Observable } from "@acryps/page-observable";
import { CardComponent } from "./card";

export class BoardCompetitorComponent extends Component {
	declare rootNode: HTMLElement;

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
			new CardComponent(card).deal().render()
		);

		let sumText = `${this.competitor.sum}`;

		if (this.competitor.cards.length && this.competitor.cards[0] == null) {
			sumText += ' + ?';
		}

		this.sumText.emit(sumText);

		await Application.waitForSeconds(+dealCardDuration.value);
	}

	async dealTrumpCard(trumpCard: AnonymousTrumpCard) {
		const trumpCardElement = new CardComponent('hidden').deal().render();
		this.cardsElement.appendChild(trumpCardElement);

		// wait for animation plus a little extra to present backside
		await Application.waitForSeconds(+dealCardDuration.value + 0.25);

		if (trumpCard != 'hidden') {
			this.competitor.storedTrumpCards.push(trumpCard);
			await this.trumpCardDialog.present(trumpCard);
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
			new CardComponent(trumpCard).deal().render()
		);

		await Application.waitForSeconds(+activateTrumpCardDuration.value);
		await this.trumpCardDialog.present(trumpCard, this.competitor.player);
	}

	async reveal(cards: number[]) {
		this.competitor.cards = cards;
		this.sumText.emit(`${this.competitor.sum}`);
		this.update();

		// extra wait time to savor reveal
		await Application.waitForSeconds(+flipCardDuration.value + 1);
	}

	async resetBoard() {
		this.competitor.resetBoard();

		this.rootNode.setAttribute('ui-reset', '');
		Application.playSound('reset-board');

		await Application.waitForSeconds(+resetCardDuration.value);
		this.rootNode.removeAttribute('ui-reset');

		this.update();
		// extra wait time to savor reveal
		await Application.waitForSeconds(1);
	}

	async resetStoredTrumpCards() {
		this.competitor.storedTrumpCards = [];
		this.update();
	}

	render() {
		return <ui-competitor-board>
			{this.trumpCardsElement = <ui-trump-cards>{this.competitor.playedTrumpCards.map(card => new CardComponent(card))}</ui-trump-cards>}

			{this.cardsElement = <ui-cards>{this.competitor.cards.map((card, index) => {
				const component = new CardComponent(card);

				if (index == 0 && card != null && !this.isLocalPlayer) {
					component.flip();
				}

				return component;
			})}</ui-cards>}

			<ui-sum>{this.sumText.map(value => value)} / {defaultPerfectSum}</ui-sum>

			{this.isLocalPlayer && <ui-actions ui-active={this.actionRequired}>
				<ui-action ui-click={() => this.sendAction(new ClientDrawMessage())}>Draw</ui-action>
				<ui-action ui-click={() => this.sendAction(new ClientStayMessage())}>Stay</ui-action>
			</ui-actions>}

			{this.trumpCardDialog = new TrumpCardDialogComponent()}
		</ui-competitor-board>;
	}

	private sendAction(message: SocketMessage) {
		this.actionRequired = false;
		GameComponent.context.playComponent.socket.send(message);

		this.update();
	}
}
