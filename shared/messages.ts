export interface PlayerMessage {
	id: string;
}

export interface PlayerJoinMessage extends PlayerMessage {
	name: string;
}

export interface ClientMessage {
	start?: boolean;
}

export interface ServerMessage {
	join?: PlayerJoinMessage,
	leave?: PlayerMessage,

	start?: boolean,
	stop?: boolean
}