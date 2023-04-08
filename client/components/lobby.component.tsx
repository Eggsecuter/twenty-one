import { Component } from "vldom";

export class LobbyComponent extends Component {
    render() {
        return <ui-lobby>
            <h1>Lobby Waiting Room</h1>
            <ui-button>Start</ui-button>
        </ui-lobby>;
    }
}
