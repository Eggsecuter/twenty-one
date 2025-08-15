import { Component } from "@acryps/page";
import { GameSettings, playerHealthOptions, roundCountOptions } from "../../../../shared/game-settings";
import { LobbyComponent } from ".";
import { IconComponent } from "../../../shared/icon";

export class SettingsComponent extends Component {
	declare parent: LobbyComponent;

	private gameSettings: GameSettings;

	constructor (
		private onsettingchange: (gameSettings: GameSettings) => void,
		private onstartgame: () => void
	) {
		super();
	}

	onload() {
		this.gameSettings = {...this.parent.parent.gameSettings};
	}

	render() {
		return <ui-settings ui-disabled={!this.parent.parent.isHost()}>
			<ui-title>{new IconComponent('options')} Settings</ui-title>

			<ui-configurable>
				<ui-setting>
					<ui-label>Round Count</ui-label>
					<ui-hint>The winner of the game is whoever wins the most rounds.</ui-hint>

					{this.renderRadioSelectSetting('roundCount', roundCountOptions)}
				</ui-setting>

				<ui-setting>
					<ui-label>Player Health</ui-label>
					<ui-hint>A round ends when a player loses all their hearts.</ui-hint>

					{this.renderRadioSelectSetting('playerHealth', playerHealthOptions)}
				</ui-setting>
			</ui-configurable>

			<ui-action ui-disabled={this.parent.parent.isHost() && this.parent.parent.players.length < 2} ui-click={() => {
				// at least two players to start
				if (this.parent.parent.players.length >= 2) {
					this.onstartgame();
				}
			}}>Start Game</ui-action>
		</ui-settings>;
	}

	renderRadioSelectSetting<Key extends keyof GameSettings>(key: Key, options: GameSettings[Key][]) {
		return <ui-radio-select>
			{options.map(option => <ui-option ui-active={this.gameSettings[key] == option} ui-click={() => {
				if (this.gameSettings[key] != option) {
					this.gameSettings[key] = option;
					this.onsettingchange(this.gameSettings);
				}
			}}>
				{option}
			</ui-option>)}
		</ui-radio-select>;
	}
}
