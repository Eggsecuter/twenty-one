import { ChatMessage } from "../../shared/chat-message";
import { ClientChatMessage } from "../../shared/messages/client";
import { SocketMessage } from "../../shared/messages/message";
import { ServerChatMessage, ServerPlayerJoinMessage, ServerPlayerLeaveMessage } from "../../shared/messages/server";
import { Player } from "../../shared/player";
import { generateToken } from "../../shared/token";

export class Game {
	readonly token: string;

	players: Player[] = [];
	isRunning: boolean;

	chatMessages: ChatMessage[] = [];

	constructor (
		private onclose: () => void
	) {
		this.token = generateToken();
	}

	join(player: Player) {
		player.socket.subscribe(ClientChatMessage, message => this.receiveChatMessage(message.message, player));

		// broadcast server player join except sender themselves
		this.broadcast(new ServerPlayerJoinMessage(player));
		this.players.push(player);

		const joinMessage = `${player.name} ${this.players.length == 1 ? 'started hosting' : 'joined'}`;
		this.audit(joinMessage);
		this.sendSystemChatMessage(joinMessage);
	}

	leave(player: Player) {
		this.players.splice(this.players.findIndex(other => other.id == player.id), 1);

		this.broadcast(new ServerPlayerLeaveMessage(player));

		const leaveMessage = `${player.name} left`;
		this.audit(leaveMessage);

		if (!this.players.length) {
			this.audit('closing lobby');
			this.onclose();
		} else {
			this.sendSystemChatMessage(leaveMessage);
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
