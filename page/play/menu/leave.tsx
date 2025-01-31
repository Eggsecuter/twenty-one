import { Component } from "@acryps/page";
import { MenuComponent } from ".";

export class DialogLeaveComponent extends Component {
	declare parent: MenuComponent;

	render() {
		return <ui-dialog-leave>
			<ui-text>Are you sure you want to leave?</ui-text>

			<ui-action-group>
				<ui-action ui-compact ui-click={() => this.parent.closeMenu()}>No</ui-action>
				<ui-action ui-compact ui-secondary ui-href=''>Yes</ui-action>
			</ui-action-group>
		</ui-dialog-leave>;
	}
}
