import { SocketService } from "./messages/service";
import { generateToken } from "./token";

export class Player {
	id: string;

	constructor (
		public socket: SocketService,
		public character: number,
		public name: string
	) {
		this.id = generateToken();
	}
}
