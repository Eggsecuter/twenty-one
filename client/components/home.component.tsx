import { Component } from "vldom";

export class HomeComponent extends Component {
    isPrivate: boolean = true;

    createLobby() {
        fetch(`/api/lobby`, { 
            method: 'POST',
            body: JSON.stringify({
                isPrivate: this.isPrivate
            })
        }).then(res => res.text())
        .then(res => {
            this.navigate(`/${res}`)
        });
    }

    render(child?) {
        return <div>
            <h1>Home</h1>

            <ui-button ui-click={() => this.createLobby()}>Create Lobby</ui-button>
        </div>;
    }
}
