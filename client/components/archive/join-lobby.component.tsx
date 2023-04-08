import { Component } from "vldom";
import { UserModel } from "../models/user.model";
import { UserSetupComponent } from "./user-setup.component";

export class JoinLobbyComponent extends Component {
    constructor(
        private user: UserModel,
        private joinLobby: () => void
    ) {
        super();
    }

    render() {
        let isSubmittable = false;
        let submitButton: HTMLButtonElement = <ui-button ui-click={() => isSubmittable && this.joinLobby()}>
                Join Lobby
            </ui-button>;

        return <div>
            {new UserSetupComponent(this.user, isValid => submitButton.setAttribute('disabled', !isValid + ''))}

            {submitButton}
        </div>;
    }
}
