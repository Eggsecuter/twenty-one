export interface PlayerMessage {
	id: string;
}

export interface PlayerJoinMessage extends PlayerMessage {
	name: string;
}

export interface PlayerDraw extends PlayerMessage {
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

	hiddenDraw?: PlayerMessage,
	draw?: PlayerDraw
}