import { Component } from "@acryps/page";
import { StateComponent } from ".";
import { ConfigurePlayerComponent } from "../../shared/configure-player";
import { Application } from "../..";

export class DirectJoinComponent extends StateComponent {
	render() {
		let joinButton: HTMLElement;

		return <ui-direct-join>
			{new ConfigurePlayerComponent(configuration => {
				Application.playerConfiguration = configuration;

				if (Application.playerConfiguration) {
					joinButton.removeAttribute('ui-disabled');
				} else {
					joinButton.setAttribute('ui-disabled', '');
				}
			})}

			{joinButton = <ui-action ui-disabled={!Application.playerConfiguration} ui-click={() => {
				if (Application.playerConfiguration) {
					// player is configured and join process can proceed
					this.parent.reload();
				}
			}}>
				Join
			</ui-action>}
		</ui-direct-join>;
	}
}
