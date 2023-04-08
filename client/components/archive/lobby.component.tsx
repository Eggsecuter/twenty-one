import { Component } from "vldom";
import APIService from "../services/api.service";
import { storeAvatarKey, storeUsernameKey } from "../util/constants";
import { GameComponent } from "./game.component";
import { CreateLobbyComponent } from "./create-lobby.component";
import { JoinLobbyComponent } from "./join-lobby.component";
import LobbySession from "../util/lobby-session";

export class LobbyComponent extends Component {
    declare params: { token: string };

    private apiService: APIService<any>;
    private apiError: string;

    constructor() {
        super();

        this.apiService = new APIService('lobby');

        LobbySession.instance.user = {
            username: localStorage.getItem(storeUsernameKey) ?? '',
            avatar: localStorage.getItem(storeAvatarKey) ?? ''
        }

    }

    updateStorage() {
        localStorage.setItem(storeAvatarKey, LobbySession.instance.user?.avatar);
        localStorage.setItem(storeUsernameKey, LobbySession.instance.user?.username);
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
                LobbySession.instance.user ?
                    new GameComponent(this.params.token, LobbySession.instance.user, () => this.leave()) :
                    this.params.token ?
                        new JoinLobbyComponent(LobbySession.instance.user, () => this.join()) :
                        new CreateLobbyComponent(LobbySession.instance.user, (_) => this.create(_))
            }
        </div>;
    }
}
