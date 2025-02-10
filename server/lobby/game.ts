import { GameSettings } from "../../shared/game-settings";
import { SocketMessage } from "../../shared/messages/message";
import { ServerRoundStartMessage } from "../../shared/messages/server";
import { Player } from "../../shared/player";
import { PlayerConnection } from "./player-connection";
import { Round } from "./round";

export type GameResult = {
	winner: Player,
	loser: Player,

	winnerWonRounds: number
}

export class Game {
	private roundWinnerIds: string[] = [];
	private currentRound: Round;

	constructor (
		private firstCompetitor: PlayerConnection,
		private secondCompetitor: PlayerConnection,
		private settings: GameSettings,
		private broadcast: (message: SocketMessage) => void,
		private onconclude: (result: GameResult) => void
	) {
		this.nextRound();

		// todo add subscriptions
		// firstCompetitor.socket
		// 	.subscribe(ClientDrawMessage, () => this.currentRound.board.draw());
	}

	private nextRound() {
		// current round has no winner yet
		const currentRoundCount = this.roundWinnerIds.length + 1;

		// game is finished
		if (currentRoundCount >= this.settings.roundCount) {
			this.conclude();
			return;
		}

		this.currentRound = new Round(this.settings.playerHealth, this.firstCompetitor.player, this.secondCompetitor.player, message => this.broadcast(message));
		this.broadcast(new ServerRoundStartMessage(currentRoundCount));
	}

	private conclude() {
		const firstCompetitorWonRounds = this.roundWinnerIds.reduce((total, id) => total + (id == this.firstCompetitor.player.id ? 1 : 0), 0);

		// game winner if won more than half the round (a tie isn't possible as there are only odd round counts)
		if (firstCompetitorWonRounds > Math.floor(this.settings.roundCount / 2)) {
			this.onconclude({
				winner: this.firstCompetitor.player,
				loser: this.secondCompetitor.player,
				winnerWonRounds: firstCompetitorWonRounds
			});
		} else {
			this.onconclude({
				winner: this.secondCompetitor.player,
				loser: this.firstCompetitor.player,
				winnerWonRounds: this.settings.roundCount - firstCompetitorWonRounds
			});
		}
	}
}
