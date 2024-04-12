import { Component } from "@acryps/page";
import { GameComponent } from ".";
import { CompetitorComponent } from "./competitor";
import { CompetitorMessage, PlayerMessage, ServerMessage } from "../../shared/messages";
import { ControlsComponent } from "./controls";

export class BoardComponent extends Component {
	declare parent: GameComponent;

	activeCompetitorId: string;

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
		if (this.parent.playerId == this.competitors.competitorTwo.id) {
			this.front = new CompetitorComponent(this.competitors.competitorTwo.id);
			this.back = new CompetitorComponent(this.competitors.competitorOne.id);
		} else {
			this.front = new CompetitorComponent(this.competitors.competitorOne.id);
			this.back = new CompetitorComponent(this.competitors.competitorTwo.id);
		}

		this.parent.socket.onmessage = event => {
			const data = JSON.parse(event.data) as ServerMessage;

			if ('stay' in data) {
				this.activeCompetitorId = data.stay.next.id;
				this.update();
			}

			if ('draw' in data) {
				this.getAffectedCompetitor(data.draw).draw(data.draw.card);
				this.activeCompetitorId = data.draw.next.id;

				this.update();
			}
		}
	}

	render() {
		return <ui-board>
			{this.back}
			{this.front}

			{this.activeCompetitorId == this.parent.playerId ? new ControlsComponent() : ''}
		</ui-board>;
	}

	private getAffectedCompetitor(message: PlayerMessage) {
		if (message.id == this.front.playerId) {
			return this.front;
		} else if (message.id == this.back.playerId) {
			return this.back;
		}
	}
}