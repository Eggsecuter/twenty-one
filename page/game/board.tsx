import { Component } from "@acryps/page";
import { GameComponent } from ".";
import { CompetitorComponent } from "./competitor";
import { CompetitorMessage, PlayerDrawMessage, PlayerMessage } from "../../shared/messages";

export class BoardComponent extends Component {
	declare parent: GameComponent;

	private competitorOne: CompetitorComponent;
	private competitorTwo: CompetitorComponent;

	constructor (
		competitors: CompetitorMessage
	) {
		super();

		this.competitorOne = new CompetitorComponent(competitors.competitorOne.id);
		this.competitorTwo = new CompetitorComponent(competitors.competitorTwo.id);
	}

	stay() {

	}

	draw(message: PlayerDrawMessage) {
		if (message.id == this.competitorOne.playerId) {
			this.competitorOne.cards.push(message.card);
		} else if (message.id == this.competitorTwo.playerId) {
			this.competitorTwo.cards.push(message.card);
		}

		this.update();
	}

	hiddenDraw(message: PlayerMessage) {
		if (message.id == this.competitorOne.playerId) {
			this.competitorOne.cards.push(null);
		} else if (message.id == this.competitorTwo.playerId) {
			this.competitorTwo.cards.push(null);
		}

		this.update();
	}

	render() {
		// defaults to competitor one being in front
		// competitor two in front if it is the local player
		const competitors = this.parent.player.id == this.competitorTwo.playerId ?
			[this.competitorTwo, this.competitorOne] :
			[this.competitorOne, this.competitorTwo];

		return <ui-board>
			{competitors}
		</ui-board>;
	}
}