export interface PlayerMessage {
	id: string;
}

export interface PlayerJoinMessage extends PlayerMessage {
	name: string;
}

export interface PlayerStatsMessage extends PlayerMessage {
	health: number,
	cards: number[]
}

export interface PlayerActionMessage extends PlayerMessage {
	next: PlayerMessage;
}

export interface PlayerDrawMessage extends PlayerActionMessage {
	card: number;
}

export interface CompetitorMessage {
	competitorOne: PlayerMessage;
	competitorTwo: PlayerMessage;
}

export interface RoundConcludeMessage {
	competitorOne: PlayerStatsMessage,
	competitorTwo: PlayerStatsMessage,

	winner: PlayerMessage
}

export interface ClientMessage {
	start?: boolean;
	draw?: boolean;
	stay?: boolean;
}

export interface ServerMessage {
	join?: PlayerJoinMessage,
	leave?: PlayerMessage,

	start?: CompetitorMessage,
	stop?: boolean,

	draw?: PlayerDrawMessage,
	stay?: PlayerActionMessage,

	conclude?: RoundConcludeMessage
}