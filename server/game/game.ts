import { Player } from "./player";
import { ServerMessage } from "../../shared/messages";
import { generateToken } from "../../shared/token";
import { Round } from "./round";
import { PlayerState } from "./player-state";

export class Game {
	readonly token: string;

	players: Player[];
	isRunning: boolean;

	playerOne: PlayerState;
	playerTwo: PlayerState;
	round: Round;

	constructor(
		private onclose: () => void
	) {
		this.token = generateToken();
		this.players = [];
		this.isRunning = false;

		console.log(`game "${this.token}" created`);
	}

	join(player: Player) {
		this.players.push(player);
		
		this.broadcast({
			join: player
		});

		console.log(`player "${player.name}" joined game "${this.token}"`);
	}

	leave(player: Player) {
		this.players.splice(this.players.indexOf(player), 1);

		this.broadcast({
			leave: player
		});

		const playerLeaveMessage = `player "${player.name}" left game "${this.token}"`;

		if (this.players.length) {
			console.log(`${playerLeaveMessage}, "${this.players[0].name}" is now host`);
		} else {
			console.log(playerLeaveMessage);
			this.stop();
			this.close();
		}
	}

	start(player: Player) {
		if (!this.isHost(player)) {
			console.warn(`non host user ${player.name} tried to start the game ${this.token}`);
			return;
		}

		this.broadcast({
			start: true
		});

		this.isRunning = true;
		console.log(`started game ${this.token}`);

		this.playerOne = new PlayerState(() => this.stop());
		this.playerTwo = new PlayerState(() => this.stop());

		const startNewRound = (index: number = 0) => {
			this.round = new Round(index, this.players, this.playerOne, this.playerTwo, () => startNewRound(index + 1));
		}

		startNewRound();
	}

	private stop() {
		if (this.isRunning) {
			this.broadcast({
				stop: true
			});

			this.isRunning = false;

			console.log(`stopped game "${this.token}"`);
		}
	}

	private close() {
		console.log(`closed game "${this.token}"`)
		this.onclose();
	}

	private isHost(player: Player) {
		// first player is always the host
		return this.players.indexOf(player) == 0;
	}

	private broadcast(message: ServerMessage) {
		for (const player of this.players) {
			player.send(message);
		}
	}
}