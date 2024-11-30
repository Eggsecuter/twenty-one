import { Component } from "@acryps/page";
import { StateComponent } from ".";

export class ConnectionLostComponent extends StateComponent {
	render() {
		return <ui-connection-lost>
			<ui-text>You lost connection.</ui-text>

			<ui-action-group>
				<ui-action ui-click={() => location.reload()}>Try to reconnect</ui-action>
				<ui-action ui-secondary ui-href=''>Leave</ui-action>
			</ui-action-group>
		</ui-connection-lost>;
	}
}
