import { Component } from "@acryps/page";
import { GameComponent } from ".";
import { CompetitorComponent } from "./competitor";
import { PlayerMessage, ServerMessage } from "../../shared/messages";
import { ControlsComponent } from "./controls";
import { Player } from "./player";
import { RoundEndComponent } from "./round-end";
import { resultShowDurationSeconds } from "../../shared/game-settings";

export class BoardComponent extends Component {
	declare parent: GameComponent;

	activeCompetitorId: string;

	private turnIndicator: HTMLElement = <ui-turn-indicator>
		<ui-arrow></ui-arrow>
	</ui-turn-indicator>;

	private front: CompetitorComponent;
	private back: CompetitorComponent;

	private result: string;
	private roundWinner: Player;

	constructor (
		competitorFront: Player,
		competitorBack: Player,
		private waitUntilRoundEnd: boolean
	) {
		super();

		this.front = new CompetitorComponent(competitorFront);
		this.back = new CompetitorComponent(competitorBack);
	}

	onload() {
		this.parent.socket.onmessage = event => {
			const data = JSON.parse(event.data) as ServerMessage;

			if (!this.waitUntilRoundEnd) {
				if ('stay' in data) {
					this.activeCompetitorId = data.stay.next.id;

					this.update();
				}

				if ('draw' in data) {
					if (this.result) {
						this.front.reset();
						this.back.reset();

						this.result = '';
						this.roundWinner = null;
					}

					this.getCompetitor(data.draw).draw(data.draw.card);
					this.activeCompetitorId = data.draw.next.id;

					this.update();
				}
			}

			if ('conclude' in data) {
				this.result = 'And the winner is ...';
				this.update();

				setTimeout(() => {
					this.getCompetitor(data.conclude.competitorOne).conclude(data.conclude.competitorOne);
					this.getCompetitor(data.conclude.competitorTwo).conclude(data.conclude.competitorTwo);

					const winner = this.getCompetitor(data.conclude.winner);

					if (winner) {
						this.result = `${winner.player.name} wins`;
					} else {
						this.result = 'It is a tie';
					}

					this.update();

					this.waitUntilRoundEnd = false;
					this.activeCompetitorId = null;
				}, resultShowDurationSeconds / 2 * 1000);
			}

			if ('endRound' in data) {
				this.roundWinner = this.getCompetitor(data.endRound).player;
				this.update();
			}

			requestAnimationFrame(() => {
				this.turnIndicator.removeAttribute('ui-up');
				this.turnIndicator.removeAttribute('ui-down');

				if (this.activeCompetitorId) {
					if (this.activeCompetitorId == this.front.player.id) {
						this.turnIndicator.setAttribute('ui-down', '');
					} else if (this.activeCompetitorId == this.back.player.id) {
						this.turnIndicator.setAttribute('ui-up', '');
					}
				}
			});
		}
	}

	render() {
		return this.waitUntilRoundEnd ? <ui-board>
			Please wait until the current round has ended...
		</ui-board> : <ui-board>
			<ui-round-indicator>Round {this.parent.currentRound}/{this.parent.roundCount}</ui-round-indicator>
			{this.turnIndicator}

			{this.back}
			<ui-result>{this.result}</ui-result>
			{this.front}

			{this.activeCompetitorId == this.parent.playerId ? new ControlsComponent() : ''}

			{this.roundWinner && new RoundEndComponent(this.roundWinner, this.parent.currentRound)}
		</ui-board>;
	}

	private getCompetitor(message: PlayerMessage) {
		if (message.id == this.front.player.id) {
			return this.front;
		} else if (message.id == this.back.player.id) {
			return this.back;
		}
	}
}