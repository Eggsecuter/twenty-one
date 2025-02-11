import { ChatMessage } from "../../shared/chat-message";
import { GameSettings } from "../../shared/game-settings";
import { ClientChatMessage, ClientGameSettingsMessage, ClientGameStartMessage, ClientKickMessage } from "../../shared/messages/client";
import { SocketMessage } from "../../shared/messages/message";
import { ServerChatMessage, ServerGameAbortMessage, ServerGameResultMessage, ServerGameSettingsMessage, ServerGameStartMessage, ServerKickMessage, ServerPlayerJoinMessage, ServerPlayerLeaveMessage } from "../../shared/messages/server";
import { Player } from "../../shared/player";
import { generateToken } from "../../shared/token";
import { Game } from "./game";
import { PlayerConnection } from "./player-connection";

const maxPlayerConnections = 20;
const emptyLobbyClosingDelay = 60000;

export type BroadcastMessage = SocketMessage | ((playerConnection: PlayerConnection) => SocketMessage);

export class Lobby {
	readonly token: string;

	playerConnections: PlayerConnection[] = [];
	kickedDeviceIds: string[] = [];

	settings: GameSettings;
	chatMessages: ChatMessage[] = [];

	game: Game;

	get isFull() {
		return this.playerConnections.length >= maxPlayerConnections;
	}

	get host() {
		return this.playerConnections[0];
	}

	constructor (
		private onclose: () => void
	) {
		this.token = generateToken();
		this.settings = new GameSettings();
	}

	join(playerConnection: PlayerConnection) {
		playerConnection.socket
			.subscribe(ClientChatMessage, message => this.receiveChatMessage(message.message, playerConnection.player))
			.subscribe(ClientGameSettingsMessage, message => this.isHost(playerConnection.player) && this.updateSettings(message.gameSettings))
			.subscribe(ClientKickMessage, message => this.isHost(playerConnection.player) && this.kick(message.player))
			.subscribe(ClientGameStartMessage, () => this.isHost(playerConnection.player) && this.start());

		// broadcast server player join except sender themselves
		this.broadcast(new ServerPlayerJoinMessage(playerConnection.player));
		this.playerConnections.push(playerConnection);

		const joinMessage = `${playerConnection.player.name} ${this.playerConnections.length == 1 ? 'started hosting' : 'joined'}`;
		this.audit(joinMessage);
		this.sendSystemChatMessage(joinMessage);
	}

	leave(leavingPlayerConnection: PlayerConnection) {
		const hostLeaving = this.host.player.id == leavingPlayerConnection.player.id;
		// when one of the competitors leave (first and second player in the lobby) on a running game it gets aborted and it goes back to the lobby
		const abortGame = this.game && (hostLeaving || this.playerConnections.indexOf(leavingPlayerConnection) == 1);

		this.playerConnections.splice(this.playerConnections.findIndex(other => other.player.id == leavingPlayerConnection.player.id), 1);
		this.broadcast(new ServerPlayerLeaveMessage(leavingPlayerConnection.player));

		const leaveMessage = `${leavingPlayerConnection.player.name} left`;
		this.audit(leaveMessage);

		if (!this.playerConnections.length) {
			setTimeout(() => {
				if (!this.playerConnections.length) {
					this.audit('closing lobby');
					this.onclose();
				}
			}, emptyLobbyClosingDelay);
		} else {
			this.sendSystemChatMessage(leaveMessage);

			if (hostLeaving) {
				const hostChangeMessage = `${this.host?.player.name} is now hosting`;

				this.audit(hostChangeMessage);
				this.sendSystemChatMessage(hostChangeMessage);
			}

			if (abortGame) {
				this.game = null;

				this.audit('game aborted (a competitor left)');
				this.broadcast(new ServerGameAbortMessage());
			}
		}
	}

	private kick(player: Player) {
		const playerConnection = this.playerConnections.find(playerConnection => playerConnection.player.id == player.id);

		if (!playerConnection) {
			return;
		}

		// broadcast kick
		this.kickedDeviceIds.push(playerConnection.deviceId);
		this.broadcast(new ServerKickMessage(playerConnection.player));

		// remove player
		const kickedPlayerIndex = this.playerConnections.findIndex(other => other.player.id == playerConnection.player.id);
		this.playerConnections[kickedPlayerIndex].socket.disable();
		this.playerConnections.splice(kickedPlayerIndex, 1);

		// broadcast kick message
		const hostChangeMessage = `${this.host.player.name} kicked ${playerConnection.player.name}`;
		this.audit(hostChangeMessage);
		this.sendSystemChatMessage(hostChangeMessage);
	}

	private updateSettings(gameSettings: GameSettings) {
		this.settings = gameSettings;
		this.broadcast(new ServerGameSettingsMessage(this.settings));
	}

	private start() {
		if (this.playerConnections.length < 2) {
			return;
		}

		this.game = new Game(
			this.playerConnections[0],
			this.playerConnections[1],
			this.settings,
			message => this.broadcast(message),
			result => {
				this.broadcast(new ServerGameResultMessage(result));
			}
		)

		this.audit('game started');
		this.broadcast(new ServerGameStartMessage());
	}

	private isHost(player: Player) {
		return this.host.player.id == player.id;
	}

	private sendSystemChatMessage(message: string) {
		const serverChatMessage = new ServerChatMessage(message);

		this.chatMessages.push(serverChatMessage.chatMessage);

		this.broadcast(serverChatMessage);
	}

	private receiveChatMessage(message: string, player: Player) {
		const serverChatMessage = new ServerChatMessage(message, player);
		this.chatMessages.push(serverChatMessage.chatMessage);

		this.broadcast(serverChatMessage);
	}

	private audit(message: string) {
		console.log(`[${this.token}] ${message}`);
	}

	private broadcast(message: BroadcastMessage) {
		for (const playerConnection of this.playerConnections) {
			const result = typeof message == 'function' ? message(playerConnection) : message;

			playerConnection.socket.send(result);
		}
	}
}
