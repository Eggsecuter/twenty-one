import { ChatMessage } from "../../shared/chat-message";
import { GameSettings } from "../../shared/game-settings";
import { ClientChatMessage, ClientGameSettingsMessage, ClientKickMessage } from "../../shared/messages/client";
import { SocketMessage } from "../../shared/messages/message";
import { ServerChatMessage, ServerGameSettingsMessage, ServerKickMessage, ServerPlayerJoinMessage, ServerPlayerLeaveMessage } from "../../shared/messages/server";
import { Player } from "../../shared/player";
import { generateToken } from "../../shared/token";
import { PlayerConnection } from "./player-connection";

export class Game {
	readonly token: string;

	playerConnections: PlayerConnection[] = [];
	kickedDeviceIds: string[] = [];

	isRunning: boolean;
	settings: GameSettings;
	chatMessages: ChatMessage[] = [];

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
			.subscribe(ClientGameSettingsMessage, message => this.host.player.id == playerConnection.player.id && this.updateSettings(message.gameSettings))
			.subscribe(ClientKickMessage, message => this.host.player.id == playerConnection.player.id && this.kick(message.player));

		// broadcast server player join except sender themselves
		this.broadcast(new ServerPlayerJoinMessage(playerConnection.player));
		this.playerConnections.push(playerConnection);

		const joinMessage = `${playerConnection.player.name} ${this.playerConnections.length == 1 ? 'started hosting' : 'joined'}`;
		this.audit(joinMessage);
		this.sendSystemChatMessage(joinMessage);
	}

	leave(playerConnection: PlayerConnection) {
		const hostLeaving = this.host.player.id == playerConnection.player.id;

		this.playerConnections.splice(this.playerConnections.findIndex(other => other.player.id == playerConnection.player.id), 1);
		this.broadcast(new ServerPlayerLeaveMessage(playerConnection.player));

		const leaveMessage = `${playerConnection.player.name} left`;
		this.audit(leaveMessage);

		if (!this.playerConnections.length) {
			this.audit('closing lobby');
			this.onclose();
		} else {
			this.sendSystemChatMessage(leaveMessage);

			if (hostLeaving) {
				const hostChangeMessage = `${this.host?.player.name} is now hosting`;

				this.audit(hostChangeMessage);
				this.sendSystemChatMessage(hostChangeMessage);
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

	private broadcast(message: SocketMessage) {
		for (const playerConnection of this.playerConnections) {
			playerConnection.socket.send(message);
		}
	}
}
