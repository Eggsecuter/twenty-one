import { Component } from "vldom";
import { UserModel } from "../models/user.model";

export class UserSetupComponent extends Component {
    constructor(
        private user: UserModel,
        private formChanged: (isValid: boolean) => void
    ) {
        super();

        this.validate();
    }

    validate() {
        this.formChanged(
            !!this.user.username
            && !!this.user.avatar
        );
    }

    avatarChange(value: string) {
        this.user.avatar = value;
        this.validate();
    }

    usernameChange(value: string) {
        this.user.username = value;
        this.validate();
    }

    render() {
        return <div>
            <p>
                Avatar 
                <input type="text" value={this.user.avatar} ui-keyup={value => this.avatarChange(value)} />
            </p>

            <p>
                Username 
                <input type="text" value={this.user.username} ui-keyup={value => this.usernameChange(value)} />
            </p>
        </div>;
    }
}
