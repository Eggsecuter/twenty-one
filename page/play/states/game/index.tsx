import { Component } from "@acryps/page";
import { SocketMessageHandlerQueue } from "./socket-message-handler-queue";
import { StateComponent } from "..";
import { MenuComponent } from "../../menu";
import { BoardComponent } from "./board";
import { StatsComponent } from "./stats";
import { AnonymousTrumpCard, ServerBoardResultMessage, ServerDrawMessage, ServerGameAbortMessage, ServerGameResultMessage, ServerInitialBoardMessage, ServerRoundResultMessage, ServerRoundStartMessage, ServerStayMessage, ServerUseTrumpCardMessage } from "../../../../shared/messages/server";
import { GameContext } from "./context";
import { RoundComponent } from "./round";
import { ResultComponent } from "./result";

export class GameComponent extends StateComponent {
	static context: GameContext;

	private handlerQueue = new SocketMessageHandlerQueue();
	private currentCompetitorIndex: number;

	private resultComponent: ResultComponent;

	get currentCompetitor() {
		return GameComponent.context.competitorContexts[this.currentCompetitorIndex];
	}

	get waitingCompetitor() {
		return GameComponent.context.competitorContexts[1 - this.currentCompetitorIndex];
	}

	constructor (
		private onabort: () => void
	) {
		super();
	}

	onload() {
		GameComponent.context = new GameContext(this.parent);

		this.addSocketSubscription(ServerGameAbortMessage, () => this.onabort());

		this.addSocketSubscription(ServerRoundStartMessage, message => this.handlerQueue.push(async () => GameComponent.context.roundComponent.announce(message.current)));

		this.addSocketSubscription(ServerInitialBoardMessage, message => this.handlerQueue.push(async () => {
			this.currentCompetitorIndex = this.getCompetitorIndex(message.startingCompetitor.id);

			await this.currentCompetitor.boardComponent.dealCard(message.startingCompetitor.hiddenCard);
			await this.waitingCompetitor.boardComponent.dealCard(message.waitingCompetitor.hiddenCard);
			await this.currentCompetitor.boardComponent.dealCard(message.startingCompetitor.shownCard);
			await this.waitingCompetitor.boardComponent.dealCard(message.waitingCompetitor.shownCard);
			await this.currentCompetitor.boardComponent.dealTrumpCard(message.startingCompetitor.trumpCard);
			await this.waitingCompetitor.boardComponent.dealTrumpCard(message.waitingCompetitor.trumpCard);

			await this.currentCompetitor.boardComponent.callForAction();
		}));

		this.addSocketSubscription(ServerStayMessage, message => this.handlerQueue.push(() => this.handleEndTurnAction(message.roundOver)));
		this.addSocketSubscription(ServerDrawMessage, message => this.handlerQueue.push(() => this.handleEndTurnAction(message.roundOver, message.card, message.trumpCard)));
		this.addSocketSubscription(ServerUseTrumpCardMessage, message => this.handlerQueue.push(() => this.currentCompetitor.boardComponent.activateTrumpCard(message.trumpCard)));

		this.addSocketSubscription(ServerBoardResultMessage, message => this.handlerQueue.push(async () => {
			await GameComponent.context.informationComponent.announce('The winner is...', 2);

			const firstCompetitorContext = GameComponent.context.competitorContexts[this.getCompetitorIndex(message.firstCompetitor.id)];
			const secondCompetitorContext = GameComponent.context.competitorContexts[this.getCompetitorIndex(message.secondCompetitor.id)];

			await Promise.all([
				firstCompetitorContext.boardComponent.reveal(message.firstCompetitor.cards),
				secondCompetitorContext.boardComponent.reveal(message.secondCompetitor.cards),
				GameComponent.context.informationComponent.announce(message.winner ? message.winner.name : `It's a tie`, 1)
			]);

			if (message.winner) {
				const opponent = GameComponent.context.competitorContexts[1 - this.getCompetitorIndex(message.winner.id)];
				await opponent.statsComponent.takeDamage();
			}

			await Promise.all([
				firstCompetitorContext.boardComponent.resetBoard(),
				secondCompetitorContext.boardComponent.resetBoard()
			]);
		}));

		this.addSocketSubscription(ServerRoundResultMessage, message => this.handlerQueue.push(async () => {
			await GameComponent.context.informationComponent.announce(`${message.winner.name} survived this round`, 2);

			await Promise.all([
				this.currentCompetitor.boardComponent.resetStoredTrumpCards(),
				this.currentCompetitor.statsComponent.resetHealth(),
				this.waitingCompetitor.boardComponent.resetStoredTrumpCards(),
				this.waitingCompetitor.statsComponent.resetHealth()
			]);
		}));

		this.addSocketSubscription(ServerGameResultMessage, message => this.handlerQueue.push(async () => this.resultComponent.show(message)));
	}

	async handleEndTurnAction(roundOver: boolean, card?: number, trumpCard?: AnonymousTrumpCard) {
		const promises = [];

		promises.push(
			GameComponent.context.informationComponent.announce(`${this.currentCompetitor.competitor.player.name} ${card == null ? 'stays' : 'draws'}`, 1)
		);

		if (card != null) {
			promises.push(
				new Promise<void>(async done => {
					if (trumpCard != null) {
						await this.currentCompetitor.boardComponent.dealTrumpCard(trumpCard);
					}

					await this.currentCompetitor.boardComponent.dealCard(card);
					done();
				})
			)
		}

		await Promise.all(promises);

		if (!roundOver) {
			this.currentCompetitorIndex = 1 - this.currentCompetitorIndex;
			await this.currentCompetitor.boardComponent.callForAction();
		}
	}

	render() {
		// second competitor only in front for corresponding player themselves
		const frontCompetitorIndex = this.parent.player == GameComponent.context.competitorContexts[1].competitor.player ? 1 : 0;
		const backCompetitorIndex = 1 - frontCompetitorIndex;

		return <ui-game>
			<ui-header>
				{new RoundComponent()}
				{new MenuComponent(true)}
			</ui-header>

			<ui-main>
				{new StatsComponent(frontCompetitorIndex, backCompetitorIndex)}
				{new BoardComponent(frontCompetitorIndex, backCompetitorIndex)}
			</ui-main>

			{this.resultComponent = new ResultComponent()}
		</ui-game>;
	}

	private getCompetitorIndex(id: string) {
		return GameComponent.context.competitorContexts[0].competitor.player.id == id ? 0 : 1;
	}
}
