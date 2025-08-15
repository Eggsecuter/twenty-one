import { Component } from "@acryps/page";
import { registerDismissible } from "../../shared/dismissible";
import { Icon, IconComponent } from "../../shared/icon";
import { DialogLeaveComponent } from "./leave";

export class MenuComponent extends Component {
	declare rootNode: HTMLElement;

	private tabs: Map<Icon, Component> = new Map();
	private openTab: Icon;

	// open tab only gets set after opening the dialog
	// clicked tab is used for communication between events
	private clickedTab: Icon;

	constructor (
		runningGame: boolean
	) {
		super();

		if (runningGame) {
			// todo chat, players, settings
		}

		this.tabs.set('leave', new DialogLeaveComponent());
	}

	closeMenu() {
		this.openTab = null;
		this.update();
	}

	// todo do not update the whole component to prevent flickering ui
	render() {
		requestAnimationFrame(() => {
			registerDismissible(() => this.rootNode, () => !!this.openTab, () => {
				this.openTab = this.clickedTab;
				this.update();
			}, () => this.closeMenu());
		});

		return <ui-menu>
			<ui-tabs>
				{Array.from(this.tabs.keys()).map(icon => <ui-tab ui-active={icon == this.openTab} ui-click={() => {
					this.openTab = null;
					this.clickedTab = icon;

					// default directives stop upwards propagation
					this.rootNode.click();
				}}>
					{new IconComponent(icon)}
				</ui-tab>)}
			</ui-tabs>

			{this.openTab && <ui-dialog>
				{this.tabs.get(this.openTab)}
			</ui-dialog>}
		</ui-menu>;
	}
}
