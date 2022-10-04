import { Component } from "vldom";
import { websocketBasePath } from "../util/constants";

export class LobbyComponent extends Component {
    declare params: { token: string };

    ws?: WebSocket;
    messages: string[] = [];
    message: string = '';

    apiError: string = '';

    async onload() {
        await fetch(`/api/lobby/${this.params.token}`)
            .then(res => {
                if (!res.ok) {
                    return res.text().then(text => { throw new Error(text) })
                }
                else {
                    return res.text();
                }
            })
            .then(() => {
                this.ws = new WebSocket(`${websocketBasePath}/${this.params.token}`);

                this.ws.addEventListener('message', event => {
                    this.messages.push(event.data);
                    this.update();
                });
            })
            .catch(err => this.apiError = err);
    }

    onunload() {
        this.ws?.close();
    }

    sendTextMessage() {
        this.ws?.send(this.message);
    }

    render(child?) {
        return <div>
            <h1>Home</h1>

            <p>{this.apiError}</p>

            {
                this.apiError ? 
                <ui-alert ui-error>{this.apiError}</ui-alert> : 
                <div>
                    {
                        this.messages.map(message => 
                            <p>{message}</p>
                        )
                    }
                    
                    <input $ui-value={this.message} />
                    <ui-button ui-click={() => this.sendTextMessage()}>Send</ui-button>

                    <ui-button ui-href="/home">Leave</ui-button>
                </div>
            }

        </div>;
    }
}
