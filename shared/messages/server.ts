import { ChatMessage } from "../chat-message";
import { GameSettings } from "../game-settings";
import { Player } from "../player";
import { TrumpCard } from "../trump-card";
import { SocketMessage } from "./message";

export type CompetitorReveal = {
	id: string,
	cards: number[]
}

export type GameResult = {
	winner: Player,
	loser: Player,
	winnerWonRounds: number
}

abstract class PlayerMessage extends SocketMessage {
	constructor (
		public player: Player
	) {
		super();
	}
}

export class ServerInitialJoinMessage extends PlayerMessage {
	constructor(
		player: Player,
		public peers: Player[],
		public chatMessages: ChatMessage[],
		public gameSettings: GameSettings
	) {
		super(player);

		this.peers = peers;
	}
}

export class ServerPlayerJoinMessage extends PlayerMessage {}

export class ServerPlayerLeaveMessage extends PlayerMessage {}

export class ServerKickMessage extends PlayerMessage {}

export class ServerChatMessage extends SocketMessage {
	chatMessage: ChatMessage;

	constructor (
		message: string,
		player?: Player // system message if null
	) {
		super();

		this.chatMessage = new ChatMessage(message, player);
	}
}

export class ServerGameSettingsMessage extends SocketMessage {
	constructor (
		public gameSettings: GameSettings
	) {
		super();
	}
}

export class ServerGameStartMessage extends SocketMessage {}

export class ServerGameAbortMessage extends SocketMessage {}

export class ServerRoundStartMessage extends SocketMessage {
	constructor (
		public current: number
	) {
		super();
	}
}

export class ServerInitialBoardMessage extends SocketMessage {
	constructor (
		public currentCompetitorId: string,
		public currentTrumpCard: TrumpCard,
		public opponentTrumpCard: TrumpCard,
		public hiddenCard?: number // only show to the competitor themselves
	) {
		super();
	}
}

export class ServerStayMessage extends SocketMessage {}
export class ServerDrawMessage extends SocketMessage {
	constructor (
		public card: number,
		public trumpCard: TrumpCard
	) {
		super();
	}
}
export class ServerUseTrumpCardMessage extends SocketMessage {
	constructor (
		public trumpCard: TrumpCard
	) {
		super();
	}
}

export class ServerBoardResultMessage extends SocketMessage {
	constructor (
		public winnerId: string,
		public firstCompetitor: CompetitorReveal,
		public secondCompetitor: CompetitorReveal
	) {
		super();
	}
}

export class ServerRoundResultMessage extends SocketMessage {
	constructor (
		public winnerId: string
	) {
		super();
	}
}

export class ServerGameResultMessage extends SocketMessage {
	winner: Player;
	loser: Player;
	winnerWonRounds: number;

	constructor (
		result: GameResult
	) {
		super();
		
		this.winner = result.winner;
		this.loser = result.loser;
		this.winnerWonRounds = result.winnerWonRounds;
	}
}

export class ServerGameEndMessage extends SocketMessage {}
