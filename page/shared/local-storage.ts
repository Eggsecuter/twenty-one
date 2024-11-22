import { PlayerConfiguration } from "./player-configuration";

export class LocalStorage {
	private static playerConfigurationKey = 'twenty-one-player-configuration';

	static getPlayerConfiguration() {
		return JSON.parse(localStorage.getItem(this.playerConfigurationKey)) as PlayerConfiguration;
	}

	static setPlayerConfiguration(configuration: PlayerConfiguration) {
		localStorage.setItem(this.playerConfigurationKey, JSON.stringify(configuration));
	}
}
