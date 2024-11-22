import { Component } from "@acryps/page";
import { PlayerConfigurationComponent } from "./player-configuration";
import { GameComponent } from "./game";
import { Application } from "..";
import { LocalStorage } from "../shared/local-storage";

export class HomeComponent extends Component {
	render() {
		const gameComponent = new GameComponent();

		return <ui-home>
			<ui-introduction>
				{new PlayerConfigurationComponent(configuration => {
					Application.playerConfiguration = configuration;
					LocalStorage.setPlayerConfiguration(Application.playerConfiguration);

					gameComponent.update();
				})}

				{gameComponent}
			</ui-introduction>
		</ui-home>;
	}
}
