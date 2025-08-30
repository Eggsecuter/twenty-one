import { Component } from "@acryps/page";
import { StateComponent } from ".";

export class ConnectionLostComponent extends StateComponent {
	render() {
		return <ui-connection-lost>
			<ui-title>You lost connection</ui-title>
			<ui-description>Check your internet connection for any issues.</ui-description>

			<ui-action-group>
				<ui-action ui-click={() => this.parent.reloadAfterError()}>Try to reconnect</ui-action>
				<ui-action ui-secondary ui-href=''>Leave</ui-action>
			</ui-action-group>
		</ui-connection-lost>;
	}
}
