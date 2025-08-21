import { Component } from "@acryps/page";
import { StateComponent } from "..";
import { Application } from "../../..";
import { Competitor } from "../../../../shared/competitor";
import { EventQueue } from "../../../shared/event-queue";
import { ServerGameAbortMessage, ServerRoundStartMessage, ServerInitialBoardMessage, ServerBoardResultMessage, ServerRoundResultMessage, ServerGameResultMessage, ServerStayMessage, ServerDrawMessage, ServerUseTrumpCardMessage } from "../../../../shared/messages/server";
import { CompetitorComponent } from "./competitor";
import { MenuComponent } from "../../menu";
import { ClientDrawMessage, ClientStayMessage } from "../../../../shared/messages/client";
import { SocketMessage } from "../../../../shared/messages/message";
import { defaultPerfectSum } from "../../../../shared/constants";
import { Observable } from "@acryps/page-observable";
import { ResultComponent } from "./result";

export class GameComponent extends StateComponent {
	perfectSum = defaultPerfectSum;

	private eventQueue = new EventQueue();

	private frontCompetitor: Competitor;
	private backCompetitor: Competitor;
	private currentCompetitorId: string;
	private actionAllowed = false;

	private info = new Observable<string>();

	private currentRound = 1;

	private resultComponent: ResultComponent;

	private get currentCompetitor() {
		return this.currentCompetitorId == this.frontCompetitor.player.id ? this.frontCompetitor : this.backCompetitor;
	}

	private get waitingCompetitor() {
		return this.currentCompetitorId == this.frontCompetitor.player.id ? this.backCompetitor : this.frontCompetitor;
	}

	constructor (
		private onabort: () => void
	) {
		super();
	}

	onload() {
		// always first competitor in the front unless the second competitor is the current user
		const frontCompetitorIndex = this.parent.player.id == this.parent.players[0].id ? 0 : 1;
		this.frontCompetitor = new Competitor(this.parent.players[frontCompetitorIndex], this.parent.gameSettings.playerHealth);
		this.backCompetitor = new Competitor(this.parent.players[1 - frontCompetitorIndex], this.parent.gameSettings.playerHealth);

		this.addSocketSubscription(ServerGameAbortMessage, () => this.onabort());

		this.addSocketSubscription(ServerRoundStartMessage, message => this.eventQueue.push(async () => {
			this.currentRound = message.current;
			this.update();
		}));

		this.addSocketSubscription(ServerInitialBoardMessage, message => this.eventQueue.push(async () => {
			this.perfectSum = defaultPerfectSum;
			this.frontCompetitor.reset();
			this.backCompetitor.reset();
			this.currentCompetitorId = message.startingCompetitor.id;

			this.currentCompetitor.cards.push(message.startingCompetitor.hiddenCard);
			this.update();
			await Application.waitForSeconds(0.5);

			this.waitingCompetitor.cards.push(message.waitingCompetitor.hiddenCard);
			this.update();
			await Application.waitForSeconds(0.5);

			this.currentCompetitor.cards.push(message.startingCompetitor.shownCard);
			this.update();
			await Application.waitForSeconds(0.5);

			this.waitingCompetitor.cards.push(message.waitingCompetitor.shownCard);
			this.update();
			await Application.waitForSeconds(0.5);

			if (message.startingCompetitor.trumpCard) {
				this.currentCompetitor.storedTrumpCards.push(message.startingCompetitor.trumpCard);
				this.update();
				await Application.waitForSeconds(0.5);
			}

			if (message.waitingCompetitor.trumpCard) {
				this.waitingCompetitor.storedTrumpCards.push(message.waitingCompetitor.trumpCard);
				this.update();
				await Application.waitForSeconds(0.5);
			}

			this.actionAllowed = true;
			this.update();
		}));

		this.addSocketSubscription(ServerStayMessage, () => this.eventQueue.push(async () => {
			this.setInfo(`${this.currentCompetitor.player.name} stays!`, 1);
			await Application.waitForSeconds(1);

			this.switchCompetitor();
			this.actionAllowed = true;
			this.update();
		}));

		this.addSocketSubscription(ServerDrawMessage, message => this.eventQueue.push(async () => {
			this.setInfo(`${this.currentCompetitor.player.name} draws!`, 1);

			this.currentCompetitor.cards.push(message.card);
			this.update();
			await Application.waitForSeconds(0.5);

			if (message.trumpCard) {
				this.currentCompetitor.storedTrumpCards.push(message.trumpCard);
				this.update();
				await Application.waitForSeconds(0.5);
			}

			await Application.waitForSeconds(0.5);

			this.switchCompetitor();
			this.actionAllowed = true;
			this.update();
		}));

		this.addSocketSubscription(ServerUseTrumpCardMessage, message => message);

		this.addSocketSubscription(ServerBoardResultMessage, message => this.eventQueue.push(async () => {
			this.setInfo(`The winner is...`, 2);
			await Application.waitForSeconds(2);

			this.setInfo(message.winner ? message.winner.name : `It's a tie!`, 2);

			this.getCompetitor(message.firstCompetitor.id).cards = message.firstCompetitor.cards;
			this.getCompetitor(message.secondCompetitor.id).cards = message.secondCompetitor.cards;

			if (message.winner) {
				this.getOtherCompetitor(message.winner.id).takeDamage();
			}

			this.actionAllowed = false;

			this.update();
			await Application.waitForSeconds(2);
		}));

		this.addSocketSubscription(ServerRoundResultMessage, message => this.eventQueue.push(async () => {
			this.setInfo(`${message.winner.name} survived the round!`, 2);
			await Application.waitForSeconds(2);
		}));

		this.addSocketSubscription(ServerGameResultMessage, message => this.eventQueue.push(async () => {
			this.resultComponent = new ResultComponent(message);
			this.update();
		}));
	}

	render() {
		return <ui-game>
			<ui-header>
				<ui-round>
					<ui-label>Round</ui-label>
					<ui-value>{this.currentRound}/{this.parent.gameSettings.roundCount}</ui-value>
				</ui-round>

				{new MenuComponent(true)}
			</ui-header>

			<ui-main>
				{new CompetitorComponent(this.backCompetitor)}

				<ui-info>
					{this.info.map(message => message ? <ui-message>{message}</ui-message> : '')}
				</ui-info>

				{new CompetitorComponent(this.frontCompetitor)}

				<ui-actions ui-active={this.actionAllowed && this.currentCompetitorId == this.parent.player.id}>
					<ui-action ui-click={() => this.sendAction(new ClientDrawMessage())}>Draw</ui-action>
					<ui-action ui-click={() => this.sendAction(new ClientStayMessage())}>Stay</ui-action>
				</ui-actions>
			</ui-main>

			{this.resultComponent ?? ''}
		</ui-game>;
	}

	private sendAction(message: SocketMessage) {
		this.actionAllowed = false;
		this.parent.socket.send(message);
		this.update();
	}

	private getCompetitor(id: string) {
		return this.frontCompetitor.player.id == id ? this.frontCompetitor : this.backCompetitor;
	}

	private getOtherCompetitor(id: string) {
		return this.frontCompetitor.player.id != id ? this.frontCompetitor : this.backCompetitor;
	}

	private switchCompetitor() {
		this.currentCompetitorId = this.waitingCompetitor.player.id;
	}

	private setInfo(message: string, durationSeconds: number) {
		this.info.emit(message);

		setTimeout(() => {
			// ignore if it was overwritten by other asynchronous call
			if (this.info.currentValue == message) {
				this.info.emit(null);
			}
		}, durationSeconds * 1000);
	}
}
