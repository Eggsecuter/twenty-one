import { Component } from "vldom";
import { UserModel } from "../models/user.model";
import APIService from "../services/api.service";
import { getRandomHexColor } from "../util/color";
import { storeAvatarKey, storeUsernameKey } from "../util/constants";

export class CreateLobbyComponent extends Component {
    apiService: APIService<any>;

    user: UserModel;
    isPrivate: boolean = true;
    isUsernameValid: boolean = true;

    constructor() {
        super();

        this.apiService = new APIService('lobby');
        this.user = {
            username: localStorage.getItem(storeUsernameKey),
            avatar: localStorage.getItem(storeAvatarKey) ?? getRandomHexColor()
        }
    }

    rollAvatar() {
        this.user.avatar = getRandomHexColor();
        this.update();
    }

    validate(): boolean {
        this.isUsernameValid = !!this.user.username;

        this.update();

        return this.isUsernameValid;
    }

    submit() {
        if (!this.validate()) {
            return;
        }

        localStorage.setItem(storeAvatarKey, this.user.avatar);
        localStorage.setItem(storeUsernameKey, this.user.username);

        this.apiService.post({ isPrivate: this.isPrivate })
            .then(res => this.navigate(`/${res}`));
    }

    render() {
        return <ui-form>
            <img src="assets/avatar.svg" />

            <svg width="400" height="180">
                <rect x="50" y="20" rx="20" ry="20" width="150" height="150"
                style="fill:red;stroke:black;stroke-width:5;opacity:0.5" />
            </svg>

            <ui-field>
                <input type="color" $ui-value={this.user.avatar} />
                <label>Avatar</label>
            </ui-field>
            
            <ui-button ui-click={() => this.rollAvatar()}>Dice</ui-button>

            <ui-field>
                <label>Username</label>
                <input type="text" placeholder="Enter username" $ui-value={this.user.username} invalid={!this.isUsernameValid} />
            </ui-field>

            <ui-field>
                <input type="checkbox" $ui-value={this.isPrivate} />
                <label>Private</label>
            </ui-field>

            <ui-submit ui-click={() => this.submit()}>Create lobby</ui-submit>
        </ui-form>;
    }
}
