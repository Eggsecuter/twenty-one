import { ChatMessage } from "../chat-message";
import { GameSettings } from "../game-settings";
import { Player } from "../player";
import { SocketMessage } from "./message";

abstract class PlayerMessage extends SocketMessage {
	constructor (
		public player: Player
	) {
		super();
	}
}

export class ServerInitialJoinMessage extends PlayerMessage {
	constructor(
		player: Player,
		public peers: Player[],
		public chatMessages: ChatMessage[],
		public gameSettings: GameSettings
	) {
		super(player);

		this.peers = peers;
	}
}

export class ServerPlayerJoinMessage extends PlayerMessage {}

export class ServerPlayerLeaveMessage extends PlayerMessage {}

export class ServerKickMessage extends PlayerMessage {}

export class ServerChatMessage extends SocketMessage {
	chatMessage: ChatMessage;

	constructor (
		message: string,
		player?: Player // system message if null
	) {
		super();

		this.chatMessage = new ChatMessage(message, player);
	}
}

export class ServerGameSettingsMessage extends SocketMessage {
	constructor (
		public gameSettings: GameSettings
	) {
		super();
	}
}

export class ServerGameStartMessage extends SocketMessage {}

export class ServerGameAbortMessage extends SocketMessage {}

export class ServerRoundStartMessage extends SocketMessage {
	constructor (
		public current: number
	) {
		super();
	}
}
