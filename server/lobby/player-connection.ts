import { SocketService } from "../../shared/messages/service";
import { Player } from "../../shared/player";

export class PlayerConnection {
	// only subscriptions open during running game
	// NO lobby subscriptions
	gameSubscriptions: string[] = [];

	constructor (
		public player: Player,
		public socket: SocketService,
		public deviceId: string
	) {}

	ongameclose() {
		this.socket.unsubscribe(...this.gameSubscriptions);
	}
}
