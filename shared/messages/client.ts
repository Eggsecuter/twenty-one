import { GameSettings } from "../game-settings";
import { Player } from "../player";
import { SocketMessage } from "./message";

export class PlayerConfigurationMessage extends SocketMessage {
	constructor (
		public character: number,
		public name: string
	) {
		super();
	}
}

export class ClientKickMessage extends SocketMessage {
	constructor (
		public player: Player
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

export class ClientGameSettingsMessage extends SocketMessage {
	constructor (
		public gameSettings: GameSettings
	) {
		super();
	}
}

export class ClientGameStartMessage extends SocketMessage {}

export class ClientDrawMessage extends SocketMessage {}
export class ClientStayMessage extends SocketMessage {}
export class ClientStartRoundMessage extends SocketMessage {}
