import { Component } from "@acryps/page";

export class ControlsComponent extends Component {
	draw() {

	}

	stay() {

	}

	render() {
		return <ui-controls>
			<ui-button ui-click={() => this.draw()}>Draw</ui-button>
			<ui-button ui-click={() => this.stay()}>Stay</ui-button>
		</ui-controls>;
	}
}