import { Component } from "@acryps/page";
import { StateComponent } from ".";
import { PlayerConfiguration } from "../../shared/player-configuration";

export class ConfigurePlayerComponent extends StateComponent {
	render() {
		return <ui-configure-state>
			{new PlayerConfiguration()}
		</ui-configure-state>;
	}
}
