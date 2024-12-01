import { Component } from "@acryps/page";
import { GameSettings, playerHealthOptions, roundCountOptions } from "../../../../shared/game-settings";
import { LobbyComponent } from ".";
import { ServerGameSettingsMessage } from "../../../../shared/messages/server";

export class SettingsComponent extends Component {
	declare parent: LobbyComponent;

	private gameSettings: GameSettings;

	constructor (
		private onchange: (gameSettings: GameSettings) => void
	) {
		super();
	}

	onload() {
		this.gameSettings = {...this.parent.parent.gameSettings};

		this.parent.parent.player.socket.subscribe(ServerGameSettingsMessage, message => {
			this.parent.parent.gameSettings = message.gameSettings;
			this.gameSettings = {...this.parent.parent.gameSettings};

			this.update();
		});
	}

	render() {
		return <ui-settings ui-disabled={!this.parent.parent.isHost}>
			<ui-title>Settings</ui-title>

			{this.renderRadioSelectSetting('roundCount', roundCountOptions)}
			{this.renderRadioSelectSetting('playerHealth', playerHealthOptions)}
		</ui-settings>;
	}

	renderRadioSelectSetting<Key extends keyof GameSettings>(key: Key, options: GameSettings[Key][]) {
		return <ui-setting>
			<ui-label>{key.replace(/([A-Z][0-9])/g, ' $1').replace(/^./, str => str.toUpperCase())}</ui-label>

			<ui-radio-select>
				{options.map(option => <ui-option ui-active={this.gameSettings[key] == option} ui-click={() => {
					if (this.gameSettings[key] != option) {
						this.gameSettings[key] = option;
						this.onchange(this.gameSettings);
					}
				}}>
					{option}
				</ui-option>)}
			</ui-radio-select>
		</ui-setting>;
	}
}
