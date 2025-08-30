import { Component } from "@acryps/page";
import { StateComponent } from ".";

export class JoinErrorComponent extends StateComponent {
	constructor (
		private error: string
	) {
		super();
	}

	render() {
		return <ui-join-error>
			<ui-title>Join failed</ui-title>
			<ui-description>{this.error}</ui-description>

			<ui-action-group>
				<ui-action ui-secondary ui-click={() => this.parent.reloadAfterError()}>Retry</ui-action>
				<ui-action ui-href=''>Return to home</ui-action>
			</ui-action-group>
		</ui-join-error>;
	}
}
