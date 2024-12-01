import { ChatMessage } from "../../shared/chat-message";
import { GameSettings } from "../../shared/game-settings";
import { ClientChatMessage, ClientGameSettingsMessage } from "../../shared/messages/client";
import { SocketMessage } from "../../shared/messages/message";
import { ServerChatMessage, ServerGameSettingsMessage, ServerPlayerJoinMessage, ServerPlayerLeaveMessage } from "../../shared/messages/server";
import { Player } from "../../shared/player";
import { generateToken } from "../../shared/token";

export class Game {
	readonly token: string;

	players: Player[] = [];
	isRunning: boolean;

	settings: GameSettings;

	chatMessages: ChatMessage[] = [];

	get host() {
		return this.players[0];
	}

	constructor (
		private onclose: () => void
	) {
		this.token = generateToken();
		this.settings = new GameSettings();
	}

	join(player: Player) {
		player.socket
			.subscribe(ClientChatMessage, message => this.receiveChatMessage(message.message, player))
			.subscribe(ClientGameSettingsMessage, message => {
				if (this.host.id == player.id) {
					this.settings = message.gameSettings;
					this.broadcast(new ServerGameSettingsMessage(this.settings));
				}
			});

		// broadcast server player join except sender themselves
		this.broadcast(new ServerPlayerJoinMessage(player));
		this.players.push(player);

		const joinMessage = `${player.name} ${this.players.length == 1 ? 'started hosting' : 'joined'}`;
		this.audit(joinMessage);
		this.sendSystemChatMessage(joinMessage);
	}

	leave(player: Player) {
		const hostLeaving = this.host.id == player.id;

		this.players.splice(this.players.findIndex(other => other.id == player.id), 1);

		// send (new) host id
		this.broadcast(new ServerPlayerLeaveMessage(player, this.host?.id));

		const leaveMessage = `${player.name} left`;
		this.audit(leaveMessage);

		if (!this.players.length) {
			this.audit('closing lobby');
			this.onclose();
		} else {
			this.sendSystemChatMessage(leaveMessage);

			if (hostLeaving) {
				const hostChangeMessage = `${this.host?.name} is now hosting`;

				this.audit(hostChangeMessage);
				this.sendSystemChatMessage(hostChangeMessage);
			}
		}
	}

	private audit(message: string) {
		console.log(`[${this.token}] ${message}`);
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

	private broadcast(message: SocketMessage) {
		for (const player of this.players) {
			player.socket.send(message);
		}
	}
}
