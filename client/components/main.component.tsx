import { Component } from "vldom";
import { app } from "../main";
import { CreateLobbyComponent } from "./create-lobby.component";
import { GameComponent } from "./game.component";
import { JoinLobbyComponent } from "./join-lobby.component";

export class MainComponent extends Component {
    declare params: { token: string };

	render() {
        let page: Component;
        
        if (app.currentUser) {
            page = new GameComponent();
        } else {
            page = this.params.token ? new JoinLobbyComponent() : new CreateLobbyComponent();
        }
        
        return <ui-main>{page}</ui-main>;
	}
}
