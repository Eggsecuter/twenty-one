import { Component } from "@acryps/page";
import { registerDismissible } from "../../shared/dismissible";
import { DialogLeaveComponent } from "./leave";
import { leaveIcon } from "../../built/icons";

type Tab = {
	icon: HTMLElement,
	content: Component
}

export class MenuComponent extends Component {
	declare rootNode: HTMLElement;

	private tabs: Tab[] = [];
	private activeTabIndex: number;

	// open tab only gets set after opening the dialog
	// clicked tab is used for communication between events
	private clickedTabIndex: number;

	constructor (
		runningGame: boolean
	) {
		super();

		if (runningGame) {
			// todo chat, players, settings
		}

		this.tabs.push({ icon: leaveIcon(), content: new DialogLeaveComponent() });
	}

	closeMenu() {
		this.activeTabIndex = null;
		this.update();
	}

	// todo do not update the whole component to prevent flickering ui
	render() {
		requestAnimationFrame(() => {
			registerDismissible(() => this.rootNode, () => this.activeTabIndex != null, () => {
				this.activeTabIndex = this.clickedTabIndex;
				this.update();
			}, () => this.closeMenu());
		});

		return <ui-menu>
			<ui-tabs>
				{this.tabs.map((tab, index) => <ui-tab ui-active={index == this.activeTabIndex} ui-click={() => {
					this.activeTabIndex = null;
					this.clickedTabIndex = index;

					// default directives stop upwards propagation
					this.rootNode.click();
				}}>
					{tab.icon}
				</ui-tab>)}
			</ui-tabs>

			{this.activeTabIndex != null && <ui-dialog>
				{this.tabs[this.activeTabIndex].content}
			</ui-dialog>}
		</ui-menu>;
	}
}
