import { Component } from "@acryps/page";
import { Service } from "../service";
import { gameTokenLength } from "../../shared/token";

export class HomeComponent extends Component {
	private token = '';
	private invalidToken = false;

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
		const token = await Service.post('/game', {});

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
					<ui-action ui-create ui-click-text='Preparing Game...' ui-click={() => this.create()}>
						Create Game
					</ui-action>
				</ui-create>
			</ui-panel>
		</ui-home>
	}
}