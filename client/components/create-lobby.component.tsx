import { Component } from "vldom";
import { UserModel } from "../models/user.model";
import { UserSetupComponent } from "./user-setup.component";

export class CreateLobbyComponent extends Component {
    private isPrivate: boolean;
    private isValid: boolean;

    constructor(
        private user: UserModel,
        private createLobby: (isPrivate: boolean) => void
    ) {
        super();

        this.isPrivate = true;
        this.validate();
    }

    validate() {
        this.isValid = !!this.user.username && !!this.user.avatar;
        this.update();
    }

    render() {
        return <div>
            {new UserSetupComponent(this.user, () => this.validate())}
            
            <p>
                <input type="checkbox" $ui-value={this.isPrivate} />
                Private
            </p>

            <ui-button ui-click={() => this.isValid && this.createLobby(this.isPrivate)} disabled={!this.isValid}>
                Create Lobby
            </ui-button>
        </div>;
    }
}
