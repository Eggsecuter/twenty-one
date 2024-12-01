import { Component } from "@acryps/page";
import { StateComponent } from "..";
import { ClientGameSettingsMessage } from "../../../../shared/messages/client";
import { SettingsComponent } from "./settings";

export class LobbyComponent extends StateComponent {
	private settingsComponent: SettingsComponent;

	onhostchange() {
		this.settingsComponent.update();
	}

	render() {
		return <ui-lobby>
			<ui-versus></ui-versus>
			<ui-spectators></ui-spectators>

			{this.settingsComponent = new SettingsComponent(settings => {
				if (this.parent.isHost) {
					this.parent.player.socket.send(new ClientGameSettingsMessage(settings));
				}
			})}

			{this.parent.chatComponent}
		</ui-lobby>;
	}
}
