import { Component } from "@acryps/page";
import { GameComponent } from ".";
import { CompetitorComponent } from "./competitor";
import { CompetitorMessage, PlayerDrawMessage, PlayerMessage, ServerMessage } from "../../shared/messages";
import { ControlsComponent } from "./controls";

export class BoardComponent extends Component {
	declare parent: GameComponent;

	private isLocalTurn = false;
	private roundStarted = false;

	private front: CompetitorComponent;
	private back: CompetitorComponent;

	constructor (
		private competitors: CompetitorMessage
	) {
		super();
	}

	onload() {
		// defaults to competitor one being in front
		// competitor two in front if it's the local player
		if (this.parent.id == this.competitors.competitorTwo.id) {
			this.front = new CompetitorComponent(this.competitors.competitorTwo.id);
			this.back = new CompetitorComponent(this.competitors.competitorOne.id);
		} else {
			this.front = new CompetitorComponent(this.competitors.competitorOne.id);
			this.back = new CompetitorComponent(this.competitors.competitorTwo.id);
		}

		this.parent.socket.onmessage = event => {
			const data = JSON.parse(event.data) as ServerMessage;

			if ('roundStart' in data) {
				this.roundStarted = true;

				this.update();
			}

			if ('stay' in data) {
				this.toggleControls(data.stay);

				this.update();
			}

			if ('draw' in data) {
				this.getAffectedCompetitor(data.draw).draw(data.draw.card);
				this.toggleControls(data.draw);

				this.update();
			}

			if ('hiddenDraw' in data) {
				this.getAffectedCompetitor(data.hiddenDraw).draw();
				this.toggleControls(data.hiddenDraw);

				this.update();
			}
		}
	}

	render() {
		return <ui-board>
			{this.back}
			{this.front}

			{this.isLocalTurn && this.roundStarted ? new ControlsComponent() : ''}
		</ui-board>;
	}

	private toggleControls(message: PlayerMessage) {
		// if local player is active and the opponent had his turn
		this.isLocalTurn = this.parent.id == this.front.playerId && message.id == this.back.playerId;
	}

	private getAffectedCompetitor(message: PlayerMessage) {
		if (message.id == this.front.playerId) {
			return this.front;
		} else if (message.id == this.back.playerId) {
			return this.back;
		}
	}
}