import { Component } from "@acryps/page";
import { PlayComponent } from "..";
import { SocketService } from "../../../shared/messages/service";
import { SocketMessage } from "../../../shared/messages/message";

export abstract class StateComponent extends Component {
	declare parent: PlayComponent;
	private subscriptions: string[] = [];

	onplayerschange() {};

	addSocketSubscription<Message extends SocketMessage>(messageType: new (...args: any[]) => Message, handler: (message: Message) => void) {
		this.subscriptions.push(
			this.parent.socket.subscribe(messageType, handler)
		);
	}

	closeSubscriptions(socket: SocketService) {
		socket.unsubscribe(...this.subscriptions);
	}
}
