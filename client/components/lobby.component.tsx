import { Component } from "vldom";
import { UserModel } from "../models/user.model";
import APIService from "../services/api.service";
import { storeAvatarKey, storeUsernameKey } from "../util/constants";
import { GameComponent } from "./game.component";
import { CreateLobbyComponent } from "./create-lobby.component";
import { JoinLobbyComponent } from "./join-lobby.component";

export class LobbyComponent extends Component {
    declare params: { token: string };

    private apiService: APIService<any>;

    private connected: boolean;
    private user: UserModel;
    private apiError: string;

    constructor() {
        super();

        this.apiService = new APIService('lobby');

        this.connected = false;
        this.user = {
            username: localStorage.getItem(storeUsernameKey) ?? '',
            avatar: localStorage.getItem(storeAvatarKey) ?? ''
        }

    }

    updateStorage() {
        localStorage.setItem(storeAvatarKey, this.user.avatar);
        localStorage.setItem(storeUsernameKey, this.user.username);
    }

    create(isPrivate: boolean) {
        this.updateStorage();

        this.apiService.post({ isPrivate })
            .then(res => {
                this.params.token = res;
                this.join();
            });
    }

    join() {
        this.updateStorage();

        this.apiService.get(this.params.token)
            .then(() => {
                this.connected = true;
                history.pushState(null, null, '#/' + this.params.token)
                this.update();
            })
            .catch(err => this.apiError = err);
    }

    leave() {
        this.navigate('/');
        location.reload();
    }

    render() {
        return <div>
            {
                this.apiError ? 
                <ui-alert ui-error>{this.apiError}</ui-alert> :
                this.connected ?
                    new GameComponent(this.params.token, this.user, () => this.leave()) :
                    this.params.token ?
                        new JoinLobbyComponent(this.user, () => this.join()) :
                        new CreateLobbyComponent(this.user, (_) => this.create(_))
            }
        </div>;
    }
}
