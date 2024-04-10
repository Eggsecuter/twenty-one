export interface PlayerMessage {
	id: string;
}

export interface PlayerJoinMessage extends PlayerMessage {
	name: string;
}

export interface PlayerDrawMessage extends PlayerMessage {
	card: number;
}

export interface CompetitorMessage {
	competitorOne: PlayerMessage;
	competitorTwo: PlayerMessage;
}

export interface ClientMessage {
	start?: boolean;
	draw?: boolean;
}

export interface ServerMessage {
	join?: PlayerJoinMessage,
	leave?: PlayerMessage,

	start?: CompetitorMessage,
	stop?: boolean,

	hiddenDraw?: PlayerMessage,
	draw?: PlayerDrawMessage,
	stay?: PlayerMessage
}