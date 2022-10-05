import { Component } from "vldom";
import { SocketEventType } from "../models/socket-event.model";
import { UserModel } from "../models/user.model";
import WebSocketService from "../services/web-socket.service";

export class LobbyComponent extends Component {
    declare params: { token: string };

    webSocket?: WebSocketService;
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
                this.webSocket = new WebSocketService(this.params.token, { username: 'Eggsecuter', avatar: '' });

                this.webSocket.on<UserModel>(SocketEventType.Join, (data) => {
                    this.messages.push(`* User ${data.username} joined *`);
                    this.update();
                });

                this.webSocket.on<string>(SocketEventType.ChatMessage, (data) => {
                    this.messages.push(data);
                    this.update();
                });
            })
            .catch(err => this.apiError = err);
    }

    onunload() {
        this.webSocket?.close();
    }

    sendTextMessage() {
        this.webSocket?.emit(SocketEventType.ChatMessage, this.message);
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
