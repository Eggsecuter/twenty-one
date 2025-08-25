import { Component } from "@acryps/page";
import { GameComponent } from ".";
import { Application } from "../../..";
import { roundAnimationDuration } from "./index.style";

export class RoundComponent extends Component {
	constructor() {
		super();

		GameComponent.context.roundComponent = this;
	}

	async announce(index: number) {
		GameComponent.context.roundIndex = index;
		this.update();
		await Application.waitForSeconds(+roundAnimationDuration.value);
	}

	render() {
		return <ui-round>
			<ui-label>Round</ui-label>
			<ui-value>{GameComponent.context.roundIndex} / {GameComponent.context.playComponent.gameSettings.roundCount}</ui-value>
		</ui-round>;
	}
}
