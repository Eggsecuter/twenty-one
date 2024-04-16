import { Component } from "@acryps/page";
import { GameComponent } from ".";
import { CompetitorComponent } from "./competitor";
import { CompetitorMessage, PlayerMessage, ServerMessage } from "../../shared/messages";
import { ControlsComponent } from "./controls";
import { Player } from "./player";

export class BoardComponent extends Component {
	declare parent: GameComponent;

	activeCompetitorId: string;

	private front: CompetitorComponent;
	private back: CompetitorComponent;

	constructor (
		competitorFront: Player,
		competitorBack: Player,
	) {
		super();

		this.front = new CompetitorComponent(competitorFront);
		this.back = new CompetitorComponent(competitorBack);
	}

	onload() {
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

			{this.front.player.name}

			{this.activeCompetitorId == this.parent.playerId ? new ControlsComponent() : ''}
		</ui-board>;
	}

	private getAffectedCompetitor(message: PlayerMessage) {
		if (message.id == this.front.player.id) {
			return this.front;
		} else if (message.id == this.back.player.id) {
			return this.back;
		}
	}
}