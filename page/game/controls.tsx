import { Component } from "@acryps/page";
import { BoardComponent } from "./board";

export class ControlsComponent extends Component {
	declare parent: BoardComponent;

	draw() {
		this.parent.parent.send({
			draw: true
		});
	}

	stay() {
		this.parent.parent.send({
			stay: true
		});
	}

	render() {
		return <ui-controls>
			<ui-button ui-click={() => this.draw()}>Draw</ui-button>
			<ui-button ui-click={() => this.stay()}>Stay</ui-button>
		</ui-controls>;
	}
}