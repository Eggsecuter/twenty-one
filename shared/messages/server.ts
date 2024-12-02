import { ChatMessage } from "../chat-message";
import { GameSettings } from "../game-settings";
import { Player } from "../player";
import { SocketMessage } from "./message";

function toPeerPlayer(player: Player) {
	if (player) {
		// don't send the socket
		player = {...player};
		player.socket = null;
	}

	return player;
}

abstract class PlayerMessage extends SocketMessage {
	player: Player;

	constructor (
		player: Player
	) {
		super();

		this.player = toPeerPlayer(player);
	}
}

export class ServerInitialJoinMessage extends PlayerMessage {
	peers: Player[]

	constructor(
		player: Player,
		peers: Player[],
		public chatMessages: ChatMessage[],
		public gameSettings: GameSettings
	) {
		super(player);

		this.peers = peers.map(peer => toPeerPlayer(peer));
	}
}

export class ServerPlayerJoinMessage extends PlayerMessage {}

export class ServerPlayerLeaveMessage extends PlayerMessage {
	constructor (
		player: Player,
		public hostId: string
	) {
		super(player);
	}
}

export class ServerChatMessage extends SocketMessage {
	chatMessage: ChatMessage;

	constructor (
		message: string,
		player?: Player // system message if null
	) {
		super();

		this.chatMessage = new ChatMessage(message, toPeerPlayer(player));
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
