import { Component } from "@acryps/page";
import { StateComponent } from ".";

export class KickedComponent extends StateComponent {
	render() {
		return <ui-join-error>
			<ui-title>You've been kicked by the host</ui-title>
			<ui-description>Shame on you! You're on the naughty list now.</ui-description>

			<ui-action-group>
				<ui-action ui-href=''>Accept your fate</ui-action>
			</ui-action-group>
		</ui-join-error>;
	}
}
