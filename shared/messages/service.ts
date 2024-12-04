import { SocketMessage } from "./message";
import { ServerChatMessage, ServerGameSettingsMessage, ServerGameStartMessage, ServerInitialJoinMessage, ServerKickMessage, ServerPlayerJoinMessage, ServerPlayerLeaveMessage } from "./server";
import { PlayerConfigurationMessage, ClientChatMessage, ClientGameStartMessage, ClientDrawMessage, ClientStayMessage, ClientStartRoundMessage, ClientGameSettingsMessage, ClientKickMessage } from "./client";

const messageTypes: Array<typeof SocketMessage> = [
	ServerInitialJoinMessage,
	ServerPlayerJoinMessage,
	ServerPlayerLeaveMessage,
	ServerKickMessage,
	ServerChatMessage,
	ServerGameSettingsMessage,
	ServerGameStartMessage,
	PlayerConfigurationMessage,
	ClientKickMessage,
	ClientChatMessage,
	ClientGameSettingsMessage,
	ClientGameStartMessage,
	ClientDrawMessage,
	ClientStayMessage,
	ClientStartRoundMessage
];

export class SocketService {
	private subscribers: Array<{id: number, handler: (message: any) => void}> = [];

	constructor(
		private socket: WebSocket
	) {
		this.socket.onmessage = event => {
			const message = JSON.parse(event.data, (_, value) => {
				// parse dates
				if (typeof value == 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z?$/.test(value)) {
					return new Date(value);
				}

				return value;
			}) as SocketMessage;

			// multiple subscribers for same event possible
			for (const subscriber of this.subscribers) {
				if (subscriber.id == message['$id']) {
					subscriber.handler(message);
				}
			}
		}
	}

	send(message: SocketMessage) {
		message['$id'] = messageTypes.findIndex(type => message instanceof type);

		this.socket.send(JSON.stringify(message));
	}

	subscribe<Message extends SocketMessage>(messageType: new (...args: any[]) => Message, handler: (message: Message) => void) {
		this.subscribers.push({
			id: messageTypes.findIndex(type => messageType == type),
			handler
		});

		return this;
	}

	// ignore socket events
	disable() {
		this.socket.onclose = () => {};
		this.socket.onmessage = () => {};
		this.socket.onerror = () => {};
	}

	close() {
		this.socket.close();
	}
}
