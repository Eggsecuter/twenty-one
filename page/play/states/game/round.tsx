import { Component } from "@acryps/page";
import { GameComponent } from ".";
import { Application } from "../../..";
import { roundAnimationDuration } from "./index.style";
import { Observable } from "@acryps/page-observable";

export class RoundComponent extends Component {
	declare rootNode: HTMLElement;

	private roundIndex = new Observable<number>(0);

	constructor() {
		super();

		GameComponent.context.roundComponent = this;
	}

	async announce(index: number) {
		GameComponent.context.roundIndex = index;
		this.roundIndex.emit(index);

		this.rootNode.setAttribute('ui-announce', '');
		await Application.waitForSeconds(+roundAnimationDuration.value);
		this.rootNode.removeAttribute('ui-announce');
	}

	render() {
		return <ui-round>
			<ui-label>Round</ui-label>
			<ui-value>{this.roundIndex.map(value => value)} / {GameComponent.context.playComponent.gameSettings.roundCount}</ui-value>
		</ui-round>;
	}
}
