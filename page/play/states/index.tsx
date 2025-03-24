import { Component } from "@acryps/page";
import { PlayComponent } from "..";
import { SocketService } from "../../../shared/messages/service";

export abstract class StateComponent extends Component {
	declare parent: PlayComponent;

	subscriptions: string[] = [];

	onunsubscribe(socket: SocketService) {
		socket.unsubscribe(...this.subscriptions);
	}

	onplayerschange() {}
}
