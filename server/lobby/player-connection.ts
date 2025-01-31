import { SocketService } from "../../shared/messages/service";
import { Player } from "../../shared/player";

export class PlayerConnection {
	constructor (
		public player: Player,
		public socket: SocketService,
		public deviceId: string
	) {}
}
