import { Component } from "@acryps/page";
import { BoardCompetitorComponent } from "./competitor";
import { InformationComponent } from "./information";
import { GameComponent } from "..";

export class BoardComponent extends Component {
	constructor (
		private frontCompetitorIndex: number,
		private backCompetitorIndex: number
	) {
		super();
	}

	render() {
		return <ui-board>
			{new BoardCompetitorComponent(this.backCompetitorIndex)}
			{new InformationComponent()}
			{new BoardCompetitorComponent(this.frontCompetitorIndex)}
		</ui-board>;
	}
}
