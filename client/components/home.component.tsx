import { Component } from "vldom";
import { websocketBasePath } from "../util/constants";

export class HomeComponent extends Component {
    ws = new WebSocket(websocketBasePath.replace('3000', '3001'));

    messages: string[] = [];
    message: string = '';

    onload() {
        this.ws.addEventListener('message', event => {
            this.messages.push(event.data);
            this.update();
        });
    }

    sendTextMessage() {
        this.ws.send(this.message);
    }

    render(child?) {
        return <div>
            <h1>Home</h1>

            {
                this.messages.map(message => 
                    <p>{message}</p>
                )
            }

            <input $ui-value={this.message} />
            <button ui-click={() => this.sendTextMessage()}>Send</button>
        </div>;
    }
}
