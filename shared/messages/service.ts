import { SocketMessage } from "./message";
import { ServerBoardResultMessage, ServerChatMessage, ServerDrawMessage, ServerGameAbortMessage, ServerGameEndMessage, ServerGameResultMessage, ServerGameSettingsMessage, ServerGameStartMessage, ServerInitialBoardMessage, ServerInitialJoinMessage, ServerKickMessage, ServerPlayerJoinMessage, ServerPlayerLeaveMessage, ServerRoundResultMessage, ServerRoundStartMessage, ServerStayMessage, ServerUseTrumpCardMessage } from "./server";
import { PlayerConfigurationMessage, ClientChatMessage, ClientGameStartMessage, ClientGameSettingsMessage, ClientKickMessage, ClientStayMessage, ClientDrawMessage, ClientUseTrumpCardMessage, ClientGameEndMessage } from "./client";

const messageTypes: Array<typeof SocketMessage> = [
	ServerInitialJoinMessage,
	ServerPlayerJoinMessage,
	ServerPlayerLeaveMessage,
	ServerKickMessage,
	ServerChatMessage,
	ServerGameSettingsMessage,
	ServerGameStartMessage,
	ServerGameAbortMessage,
	ServerRoundStartMessage,
	ServerInitialBoardMessage,
	ServerStayMessage,
	ServerDrawMessage,
	ServerUseTrumpCardMessage,
	ServerBoardResultMessage,
	ServerRoundResultMessage,
	ServerGameResultMessage,
	ServerGameEndMessage,
	PlayerConfigurationMessage,
	ClientKickMessage,
	ClientChatMessage,
	ClientGameSettingsMessage,
	ClientGameStartMessage,
	ClientStayMessage,
	ClientDrawMessage,
	ClientUseTrumpCardMessage,
	ClientGameEndMessage
];

export class SocketService {
	private subscribers: Array<{id: string, messageTypeIndex: number, handler: (message: any) => void}> = [];

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
				if (subscriber.messageTypeIndex == message['$typeIndex']) {
					subscriber.handler(message);
				}
			}
		}
	}

	send(message: SocketMessage) {
		message['$typeIndex'] = messageTypes.findIndex(type => message instanceof type);
		this.socket.send(JSON.stringify(message));
	}

	subscribe<Message extends SocketMessage>(messageType: new (...args: any[]) => Message, handler: (message: Message) => void) {
		const id = this.generateUUID();

		this.subscribers.push({
			id,
			messageTypeIndex: messageTypes.findIndex(type => messageType == type),
			handler
		});

		return id;
	}

	unsubscribe(...ids: string[]) {
		for (const id of ids) {
			const subscriberIndex = this.subscribers.findIndex(subscriber => subscriber.id == id);
	
			if (subscriberIndex) {
				this.subscribers.splice(subscriberIndex, 1);
			}
		}
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

	private generateUUID() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, char => {
		const random = (Math.random() * 16) | 0;
		const value = char === 'x' ? random : (random & 0x3) | 0x8;

		return value.toString(16);
		});
	}
}