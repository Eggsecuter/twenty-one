import { Component } from "@acryps/page";
import { StateComponent } from "..";
import { ClientGameSettingsMessage, ClientGameStartMessage } from "../../../../shared/messages/client";
import { SettingsComponent } from "./settings";
import { ServerGameSettingsMessage } from "../../../../shared/messages/server";

export class LobbyComponent extends StateComponent {
	private settingsComponent: SettingsComponent;

	onpeerschange() {
		this.settingsComponent.update();
	}

	onhostchange() {
		this.settingsComponent.update();
	}

	onload() {
		this.parent.player.socket.subscribe(ServerGameSettingsMessage, message => {
			this.parent.gameSettings = message.gameSettings;
			
			this.settingsComponent.reload();
		});
	}

	render() {
		return <ui-lobby>
			<ui-versus></ui-versus>

			{this.settingsComponent = new SettingsComponent(settings => {
				if (this.parent.isHost) {
					this.parent.player.socket.send(new ClientGameSettingsMessage(settings));
				}
			}, () => {
				if (this.parent.isHost) {
					this.parent.player.socket.send(new ClientGameStartMessage());
				}
			})}

			<ui-spectators></ui-spectators>
			{this.parent.chatComponent}
		</ui-lobby>;
	}
}
