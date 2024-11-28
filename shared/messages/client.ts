import { SocketMessage } from "./message";

export class PlayerConfigurationMessage extends SocketMessage {
	constructor (
		public character: number,
		public name: string
	) {
		super();
	}
}

export class ClientChatMessage extends SocketMessage {
	constructor (
		public message: string
	) {
		super();
	}
}

export class ClientStartMessage extends SocketMessage {}
export class ClientDrawMessage extends SocketMessage {}
export class ClientStayMessage extends SocketMessage {}
export class ClientStartRoundMessage extends SocketMessage {}
