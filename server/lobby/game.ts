import { BroadcastMessage } from ".";
import { GameSettings } from "../../shared/game-settings";
import { ClientDrawMessage, ClientStayMessage, ClientUseTrumpCardMessage } from "../../shared/messages/client";
import { ServerRoundResultMessage, ServerRoundStartMessage } from "../../shared/messages/server";
import { Player } from "../../shared/player";
import { PlayerConnection } from "./player-connection";
import { Round } from "./round";

export class Game {
	private roundWinners: Player[] = [];
	private currentRound: Round;

	constructor (
		private firstCompetitor: PlayerConnection,
		private secondCompetitor: PlayerConnection,
		private settings: GameSettings,
		private broadcast: (message: BroadcastMessage) => void,
		private onconclude: (winner: Player, wonRounds: number) => void
	) {
		this.nextRound();

		for (const competitor of [firstCompetitor, secondCompetitor]) {
			competitor.gameSubscriptions.push(
				competitor.socket.subscribe(ClientStayMessage, () => this.currentRound.stay(competitor.player)),
				competitor.socket.subscribe(ClientDrawMessage, () => this.currentRound.draw(competitor.player)),
				competitor.socket.subscribe(ClientUseTrumpCardMessage, message => this.currentRound.useTrumpCard(competitor.player, message.index))
			);
		}
	}

	close() {
		this.firstCompetitor.ongameclose();
		this.secondCompetitor.ongameclose();
	}

	private nextRound() {
		// current round has no winner yet
		const currentRoundCount = this.roundWinners.length + 1;

		// game is finished
		if (currentRoundCount > this.settings.roundCount) {
			this.conclude();
			return;
		}

		// first round start before round get initialized
		this.broadcast(new ServerRoundStartMessage(currentRoundCount));

		this.currentRound = new Round(
			this.settings.playerHealth,
			this.firstCompetitor.player,
			this.secondCompetitor.player,
			message => this.broadcast(message),
			winner => {
				this.roundWinners.push(winner.player);
				this.broadcast(new ServerRoundResultMessage(winner.player));

				this.nextRound();
			}
		);
	}

	private conclude() {
		let firstCompetitorWonRounds = 0;

		for (const roundWinner of this.roundWinners) {
			if (roundWinner.id == this.firstCompetitor.player.id) {
				firstCompetitorWonRounds++;
			}
		}

		// game winner if won more than half the round (a tie isn't possible as there are only odd round counts)
		if (firstCompetitorWonRounds > Math.floor(this.settings.roundCount / 2)) {
			this.onconclude(this.firstCompetitor.player, firstCompetitorWonRounds);
		} else {
			this.onconclude(this.secondCompetitor.player, this.settings.roundCount - firstCompetitorWonRounds);
		}
	}
}
