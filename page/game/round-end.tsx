import { Component } from "@acryps/page";
import { Player } from "./player";
import { BoardComponent } from "./board";

export class RoundEndComponent extends Component {
	declare parent: BoardComponent;

	constructor (
		private winner: Player,
		private round: number
	) {
		super();
	}

	render() {
		return <ui-round-end>
			<ui-panel>
				<ui-winner>{this.winner.name} has won round {this.round}</ui-winner>

				{this.parent.parent.isHost ? <ui-action ui-click={() => this.parent.parent.send({
					startRound: true
				})}>Next round</ui-action> : <ui-action ui-disabled>Waiting for host ...</ui-action>}
			</ui-panel>
		</ui-round-end>;
	}
}