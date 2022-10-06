import { Component } from "vldom";
import { UserModel } from "../models/user.model";
import { UserSetupComponent } from "./user-setup.component";

export class JoinLobbyComponent extends Component {
    private isValid: boolean;

    constructor(
        private user: UserModel,
        private joinLobby: () => void
    ) {
        super();

        this.validate();
    }

    validate() {
        this.isValid = !!this.user.username && !!this.user.avatar;
        this.update();
    }

    render() {
        return <div>
            {new UserSetupComponent(this.user, () => this.validate())}

            <ui-button ui-click={() => this.isValid && this.joinLobby()} disabled={!this.isValid}>
                Join Lobby
            </ui-button>
        </div>;
    }
}
