import { Component } from "@acryps/page";
import { ConfigurePlayerComponent } from "../shared/configure-player";
import { GameComponent } from "./game";
import { Application } from "..";

export class HomeComponent extends Component {
	render() {
		const gameComponent = new GameComponent();

		return <ui-home>
			<ui-introduction>
				{new ConfigurePlayerComponent(configuration => {
					Application.playerConfiguration = configuration;
					gameComponent.update();
				})}

				{gameComponent}
			</ui-introduction>
		</ui-home>;
	}
}
