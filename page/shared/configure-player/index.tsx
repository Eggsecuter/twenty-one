import { Component } from "@acryps/page";
import { LocalStorage } from "../local-storage";
import { PlayerConfiguration } from "../player-configuration";
import { characterSources } from "../characters-sources";

export class ConfigurePlayerComponent extends Component {
	private configuration: PlayerConfiguration;

	constructor (
		private onchange: (configuration: PlayerConfiguration) => void
	) {
		super();
	}

	onload() {
		this.configuration = LocalStorage.getPlayerConfiguration() ?? new PlayerConfiguration();

		this.updateConfiguration();
	}

	render() {
		let imageElement: HTMLImageElement;

		const changeCharacter = (index: (count: number) => number) => {
			const count = characterSources.length;
			this.configuration.character = index(count);

			imageElement.src = characterSources[this.configuration.character];
		}

		return <ui-configure-player>
			<input $ui-value={this.configuration.name} ui-change={() => this.updateConfiguration()} maxlength='25' placeholder='Enter your name' />

			<ui-character>
				<ui-action ui-click={() => changeCharacter(count => (this.configuration.character - 1 + count) % count)}>&lt;</ui-action>

				<ui-avatar>
					{imageElement = <img src={characterSources[this.configuration.character]} />}
				</ui-avatar>

				<ui-action ui-click={() => changeCharacter(count => (this.configuration.character + 1) % count)}>&gt;</ui-action>
			</ui-character>
		</ui-configure-player>;
	}

	private updateConfiguration() {
		let valid = true;

		if (isNaN(this.configuration.character) || !this.configuration.name) {
			valid = false;
		}

		this.onchange(valid ? this.configuration : null);
	}
}
