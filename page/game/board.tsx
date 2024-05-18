import { Component } from "@acryps/page";
import { GameComponent } from ".";
import { CompetitorComponent } from "./competitor";
import { PlayerMessage, ServerMessage } from "../../shared/messages";
import { ControlsComponent } from "./controls";
import { Player } from "./player";

export class BoardComponent extends Component {
	declare parent: GameComponent;

	activeCompetitorId: string;

	private turnIndicator: HTMLElement = <ui-turn-indicator>
		<ui-arrow></ui-arrow>
	</ui-turn-indicator>;

	private front: CompetitorComponent;
	private back: CompetitorComponent;

	private roundResult: string;

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
					if (this.roundResult) {
						this.front.reset();
						this.back.reset();
						this.roundResult = '';
					}
	
					this.getCompetitor(data.draw).draw(data.draw.card);
					this.activeCompetitorId = data.draw.next.id;
	
					this.update();
				}
			}

			if ('conclude' in data) {
				this.getCompetitor(data.conclude.competitorOne).conclude(data.conclude.competitorOne);
				this.getCompetitor(data.conclude.competitorTwo).conclude(data.conclude.competitorTwo);

				const winner = this.getCompetitor(data.conclude.winner);

				if (!winner) {
					this.roundResult = 'It is a tie';
				} else {
					this.roundResult = `${winner.player.name} wins`;
				}

				this.update();

				this.waitUntilRoundEnd = false;
				this.activeCompetitorId = null;
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
			{this.turnIndicator}

			{this.back}
			<ui-round-result>{this.roundResult}</ui-round-result>
			{this.front}

			{this.activeCompetitorId == this.parent.playerId ? new ControlsComponent() : ''}
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