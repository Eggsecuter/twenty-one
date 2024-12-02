import { Component } from "@acryps/page";
import { StateComponent } from "..";
import { ClientGameSettingsMessage, ClientGameStartMessage } from "../../../../shared/messages/client";
import { SettingsComponent } from "./settings";
import { ServerGameSettingsMessage } from "../../../../shared/messages/server";
import { VersusComponent } from "./versus";
import { SpectatorsComponent } from "./spectators";

export class LobbyComponent extends StateComponent {
	private versusComponent: VersusComponent;
	private spectators: SpectatorsComponent;
	private settingsComponent: SettingsComponent;

	onplayerschange() {
		this.versusComponent.update();
		this.spectators.update();
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
			{this.versusComponent = new VersusComponent()}

			{this.settingsComponent = new SettingsComponent(settings => {
				if (this.parent.isHost) {
					this.parent.player.socket.send(new ClientGameSettingsMessage(settings));
				}
			}, () => {
				if (this.parent.isHost) {
					this.parent.player.socket.send(new ClientGameStartMessage());
				}
			})}

			{this.spectators = new SpectatorsComponent()}

			{this.parent.chatComponent}
		</ui-lobby>;
	}
}
