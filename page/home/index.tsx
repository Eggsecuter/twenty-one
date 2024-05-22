import { Component } from "@acryps/page";
import { Service } from "../service";
import { gameTokenLength } from "../../shared/token";
import { defaultRoundCount } from "../../shared/game-settings";

export class HomeComponent extends Component {
	private token = '';
	private invalidToken = false;

	private readonly roundCounts = [1, 3, 5, 7, 9];
	private roundCount = defaultRoundCount;

	async join() {
		if (this.token.length == gameTokenLength) {
			const joinableGame = await Service.get(`/game/${this.token}`);

			if (joinableGame) {
				this.navigate(`/play/${this.token}`);
			}
		}

		this.invalidToken = true;
		this.update();
	}

	async create() {
		const token = await Service.post('/game', {
			roundCount: this.roundCount
		});

		this.navigate(`/play/${token}`);
	}

	render() {
		return <ui-home>
			<ui-panel>
				<ui-join>
					<input $ui-value={this.token} maxlength={gameTokenLength} placeholder='Code' ui-error={this.invalidToken} />

					<ui-action ui-join ui-click-text='Joining...' ui-click={() => this.join()}>
						Join
					</ui-action>
				</ui-join>

				<ui-create>
					<ui-property>
						<ui-label>Rounds</ui-label>
						<ui-description>A round ends when one of the players has no hearts left.</ui-description>
						<select $ui-value={this.roundCount}>
							{this.roundCounts.map(roundCount => <option ui-value={roundCount}>{roundCount}</option>)}
						</select>
					</ui-property>

					<ui-action ui-create ui-click-text='Preparing Game...' ui-click={() => this.create()}>
						Create Game
					</ui-action>
				</ui-create>
			</ui-panel>
		</ui-home>
	}
}