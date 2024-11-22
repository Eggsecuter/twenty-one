import { Component } from "@acryps/page";
import { Application } from "..";
import { gameTokenLength } from "../../shared/token";

export class GameComponent extends Component {
	private token = '';
	private invalidToken = false;

	async join() {
		if (!Application.playerConfiguration) {
			return;
		}

		if (this.token.length == gameTokenLength) {
			const hasGame = await Application.get(`/game/${this.token}`);

			if (hasGame) {
				this.navigate(`/play/${this.token}`);
			}
		}

		this.invalidToken = true;
		this.update();

		// only show once
		this.invalidToken = false;
	}

	async create() {
		if (!Application.playerConfiguration) {
			return;
		}

		const token = await Application.post('/game');

		this.navigate(`/play/${token}`);
	}

	render() {
		let tokenInput: HTMLInputElement;

		requestAnimationFrame(() => tokenInput.onkeyup = event => {
			if (event.key == 'Enter') {
				tokenInput.blur();
				this.join();
			}
		});

		return <ui-game ui-disabled={!Application.playerConfiguration}>
			<ui-join>
				{tokenInput = <input $ui-value={this.token} ui-invalid={this.invalidToken} maxlength='6' disabled={!Application.playerConfiguration} placeholder='Token' />}
				<ui-action ui-click={() => this.join()}>Join</ui-action>
			</ui-join>

			<ui-create>
				<ui-action ui-click={() => this.create()}>Host</ui-action>
			</ui-create>
		</ui-game>;
	}
}
