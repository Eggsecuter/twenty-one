import { Component } from "@acryps/page";
import { ServerGameResultMessage } from "../../../../shared/messages/server";
import { GameComponent } from ".";
import { ClientGameEndMessage } from "../../../../shared/messages/client";
import { characterSources } from "../../../shared/characters-sources";
import { trophyIcon } from "../../../built/icons";

export class ResultComponent extends Component {
	declare parent: GameComponent;

	private result: ServerGameResultMessage;

	constructor () {
		super();
	}

	show(message: ServerGameResultMessage) {
		this.result = message;
		this.update();
	}

	render() {
		if (!this.result) {
			return <ui-result></ui-result>;
		}

		const totalRounds = this.parent.parent.gameSettings.roundCount;
		let victoryType = 'Honorable';

		if (totalRounds > 1) {
			if (this.result.wonRounds == totalRounds) {
				victoryType = 'Flawless';
			} else if (this.result.wonRounds - 1 < totalRounds / 2) {
				victoryType = 'Hard Fought';
			}
		}

		return <ui-result ui-active>
			<ui-panel>
				<ui-title>{victoryType} Victory</ui-title>

				<ui-winner>
					<ui-avatar>
						<img src={characterSources[this.result.winner.character]} />
						{trophyIcon()}
					</ui-avatar>

					<ui-name>{this.result.winner.name}</ui-name>
					<ui-rounds-won>Won {this.result.wonRounds} / {totalRounds} rounds</ui-rounds-won>
				</ui-winner>

				<ui-action ui-disabled={!this.parent.parent.isHost()} ui-click={() => this.parent.parent.socket.send(new ClientGameEndMessage())}>
					{this.parent.parent.isHost() ? 'Return to lobby' : 'Waiting for host...'}
				</ui-action>
			</ui-panel>
		</ui-result>;
	}
}
