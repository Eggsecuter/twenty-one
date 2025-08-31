import { ChatMessage } from "../chat-message";
import { GameSettings } from "../game-settings";
import { Player } from "../player";
import { TrumpCard } from "../trump-card";
import { SocketMessage } from "./message";

// expand trump card to be able to differ between "no trump card" and "hidden trump card"
// dealt trump cards are by default hidden and only shown to the player that it belongs to
export type AnonymousTrumpCard = TrumpCard | 'hidden';

export type CompetitorReveal = {
	id: string,
	cards: number[]
}

export type InitialBoardCompetitor = {
	id: string,
	trumpCard?: AnonymousTrumpCard,
	hiddenCard?: number,
	shownCard: number
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
		public startingCompetitor: InitialBoardCompetitor,
		public waitingCompetitor: InitialBoardCompetitor
	) {
		super();
	}
}

export abstract class ServerActionMessage extends SocketMessage {
	constructor (
		public roundOver: boolean
	) {
		super();
	}
}

export class ServerStayMessage extends ServerActionMessage {}

export class ServerDrawMessage extends ServerActionMessage {
	constructor (
		roundOver: boolean,
		public card: number,
		public trumpCard?: AnonymousTrumpCard
	) {
		super(roundOver);
	}
}

export class ServerUseTrumpCardMessage extends SocketMessage {
	removedTrumpCards: TrumpCard[] = [];
	drawnTrumpCards: AnonymousTrumpCard[] = [];
	drawnCard: number;

	constructor (
		public trumpCard: TrumpCard
	) {
		super();
	}
}

export class ServerBoardResultMessage extends SocketMessage {
	constructor (
		public firstCompetitor: CompetitorReveal,
		public secondCompetitor: CompetitorReveal,
		public winner?: Player
	) {
		super();
	}
}

export class ServerRoundResultMessage extends SocketMessage {
	constructor (
		public winner: Player
	) {
		super();
	}
}

export class ServerGameResultMessage extends SocketMessage {
	constructor (
		public winner: Player,
		public wonRounds: number
	) {
		super();
	}
}

export class ServerGameEndMessage extends SocketMessage {}
