import { Component } from "@acryps/page";
import { StateComponent } from "..";
import { ServerBoardResultMessage, ServerGameAbortMessage, ServerGameResultMessage, ServerInitialBoardMessage, ServerRoundResultMessage, ServerRoundStartMessage } from "../../../../shared/messages/server";
import { MenuComponent } from "../../menu";
import { Competitor } from "../../../../shared/competitor";
import { EventQueue } from "../../../shared/event-queue";

export class GameComponent extends StateComponent {
	currentRound = 0;
	
	private frontCompetitor: Competitor;
	private backCompetitor: Competitor;
	private currentCompetitorId: string;
	
	private eventQueue = new EventQueue();
	
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

		this.subscribtions.push(
			this.parent.socket.subscribe(ServerGameAbortMessage, () => this.onabort()),

			this.parent.socket.subscribe(ServerRoundStartMessage, message => this.eventQueue.push(async () => {
				this.currentRound = message.current;
				this.update();
				await this.waitForSeconds(2);
			})),

			this.parent.socket.subscribe(ServerInitialBoardMessage, message => this.eventQueue.push(async () => {
				let startingCompetitor: Competitor;
				let secondCompetitor: Competitor;
				
				if (message.startingCompetitor.id == this.frontCompetitor.player.id) {
					startingCompetitor = this.frontCompetitor;
					secondCompetitor = this.backCompetitor;
				} else {
					startingCompetitor = this.backCompetitor;
					secondCompetitor = this.frontCompetitor;
				}
	
				startingCompetitor.cards.push(message.startingCompetitor.hiddenCard);
				this.update();
				await this.waitForSeconds(0.5);
	
				if (message.startingCompetitor.trumpCard) {
					startingCompetitor.storedTrumpCards.push(message.startingCompetitor.trumpCard);
					this.update();
					await this.waitForSeconds(0.5);
				}
				
				secondCompetitor.cards.push(message.secondCompetitor.hiddenCard);
				this.update();
				await this.waitForSeconds(0.5);
	
				if (message.secondCompetitor.trumpCard) {
					secondCompetitor.storedTrumpCards.push(message.secondCompetitor.trumpCard);
					this.update();
					await this.waitForSeconds(1);
				}
	
				this.currentCompetitorId = startingCompetitor.player.id;
				this.update();
			})),

			this.parent.socket.subscribe(ServerBoardResultMessage, message => message),
			this.parent.socket.subscribe(ServerRoundResultMessage, message => message),
			this.parent.socket.subscribe(ServerGameResultMessage, message => message)
		);
	}

	render() {
		return <ui-game>
			{new MenuComponent(true)}
			
			<ui-round>{this.currentRound} / {this.parent.gameSettings.roundCount}</ui-round>
			
			{[this.backCompetitor, this.frontCompetitor].map(competitor => <ui-competitor ui-active={this.currentCompetitorId == competitor.player.id}>
				<ui-name>{competitor.player.name}</ui-name>
				
				<ui-cards>{competitor.cards.map(card => 
					<img src={`/assets/cards/${card ?? 'back'}.png`} />
				)}</ui-cards>
				
				<ui-info>stored trump cards (inventory)</ui-info>
				<ui-stored-trump-cards>{competitor.storedTrumpCards.map(trumpCard => 
					<img src={`/assets/trump-cards/${trumpCard.icon}.webp`} />
				)}</ui-stored-trump-cards>
			</ui-competitor>)}
		</ui-game>;
	}

	private waitForSeconds(seconds: number) {
		return new Promise<void>(done => setTimeout(() => done(), seconds * 1000));
	}
}
