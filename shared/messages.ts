export interface PlayerMessage {
	id: string;
}

export interface PlayerJoinMessage extends PlayerMessage {
	name: string;
}

export interface PlayerActionMessage {
	playerOne: boolean;
}

export interface PlayerDraw extends PlayerActionMessage {
	card: number;
}

export interface ClientMessage {
	start?: boolean;
	draw?: boolean;
}

export interface ServerMessage {
	join?: PlayerJoinMessage,
	leave?: PlayerMessage,

	start?: boolean,
	stop?: boolean,

	hiddenDraw?: PlayerActionMessage,
	draw?: PlayerDraw,
	stay?: PlayerActionMessage
}