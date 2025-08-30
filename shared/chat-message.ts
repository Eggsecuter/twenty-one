import { Player } from "./player";

export class ChatMessage {
	readonly timestamp: Date;

	constructor (
		public message: string,
		public player?: Player
	) {
		this.timestamp = new Date();
	}
}
