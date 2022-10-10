import { Component } from "vldom";
import { UserModel } from "../models/user.model";
import { UserSetupComponent } from "./user-setup.component";

export class CreateLobbyComponent extends Component {
    private isPrivate: boolean;

    constructor(
        private user: UserModel,
        private createLobby: (isPrivate: boolean) => void
    ) {
        super();

        this.isPrivate = true;
    }

    render() {
        let isSubmittable = false;
        let submitButton: HTMLButtonElement = <ui-button ui-click={() => isSubmittable && this.createLobby(this.isPrivate)}>
                Create Lobby
            </ui-button>;

        return <div>
            {new UserSetupComponent(this.user, isValid => {
                submitButton.setAttribute('disabled', !isValid + '');
                isSubmittable = isValid;
            })}
            
            <p>
                <input type="checkbox" $ui-value={this.isPrivate} />
                Private
            </p>

            {submitButton}
        </div>;
    }
}
