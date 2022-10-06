import { Component } from "vldom";
import { UserModel } from "../models/user.model";
import { storeAvatarKey, storeUsernameKey } from "../util/constants";

export class UserSetupComponent extends Component {
    constructor(
        private user: UserModel,
        private changed: () => void
    ) {
        super();
    }

    formChange(storeKey: string, value: string) {
        localStorage.setItem(storeKey, value);

        this.changed();
    }

    render() {
        return <div>
            <p>
                Avatar 
                <input type="text" $ui-value={this.user.avatar} ui-change={(value: string) => this.formChange(storeAvatarKey, value)} />
            </p>

            <p>
                Username 
                <input type="text" $ui-value={this.user.username} ui-change={(value: string) => this.formChange(storeUsernameKey, value)} />
            </p>
        </div>;
    }
}
