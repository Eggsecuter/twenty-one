import { Component } from "@acryps/page";
import { StatsCompetitorComponent } from "./competitor";
import { GameComponent } from "..";

export class StatsComponent extends Component {
	constructor (
		private frontCompetitorIndex: number,
		private backCompetitorIndex: number
	) {
		super();
	}

	render() {
		return <ui-stats>
			{new StatsCompetitorComponent(this.backCompetitorIndex)}
			{new StatsCompetitorComponent(this.frontCompetitorIndex)}
		</ui-stats>;
	}
}
