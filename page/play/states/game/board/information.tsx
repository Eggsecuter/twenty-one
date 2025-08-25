import { Component } from "@acryps/page";
import { GameComponent } from "..";
import { Application } from "../../../..";
import { Observable } from "@acryps/page-observable";

export class InformationComponent extends Component {
	private narrationTimeout: number;

	private narration = new Observable<string>();

	constructor() {
		super();

		GameComponent.context.informationComponent = this;
	}

	async announce(text: string, durationSeconds: number) {
		clearTimeout(this.narrationTimeout);
		this.narration.emit(text);

		this.narrationTimeout = setTimeout(() => {
			this.narration.emit(null);
		}, durationSeconds * 1000);

		await Application.waitForSeconds(durationSeconds);
	}

	render() {
		return <ui-information>
			{this.narration.map(value => value ? <ui-narration>{value}</ui-narration> : '')}
		</ui-information>;
	}
}
