import { Component } from "vldom";
import { SocketEventType } from "../models/socket-event.model";
import { UserModel } from "../models/user.model";
import WebSocketService from "../services/web-socket.service";

export class GameComponent extends Component {
	private webSocket: WebSocketService;

    private messages: string[] = [];
    private message: string = '';

	constructor(
		private token: string,
		private user: UserModel,
		private leave: () => void
	) {
		super();

		this.webSocket = new WebSocketService(token, user);

		this.webSocket.on<UserModel>(SocketEventType.Join, (user) => {
			this.messages.push(`${user.username} joined!`);
			this.update();
		});

		this.webSocket.on<string>(SocketEventType.ChatMessage, (message) => {
			this.messages.push(message);
			this.update();
		});
	}

	onunload() {
        this.webSocket.close();
    }

	sendTextMessage() {
        this.webSocket.emit(SocketEventType.ChatMessage, this.message);
    }

	render() {
		return <div>
			<p>{location.href}</p>

			{
				this.messages.map(message => 
					<p>{message}</p>
				)
			}
			
			<input $ui-value={this.message} />
			<ui-button ui-click={() => this.sendTextMessage()}>Send</ui-button>

			<ui-button ui-click={() => this.leave()}>Leave</ui-button>
		</div>;
	}
}
