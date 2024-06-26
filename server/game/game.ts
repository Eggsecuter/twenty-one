import { Player } from "./player";
import { ServerMessage } from "../../shared/messages";
import { generateToken } from "../../shared/token";
import { Round } from "./round";
import { Competitor } from "./competitor";

export class Game {
	readonly token: string;

	players: Player[];
	isRunning: boolean;

	competitorOne: Competitor;
	competitorTwo: Competitor;

	round: Round;
	currentRound: number;

	constructor(
		public readonly roundCount: number,
		private onclose: () => void
	) {
		this.token = generateToken();
		this.players = [];
		this.isRunning = false;

		console.log(`game "${this.token}" created`);
	}

	static sleep(seconds: number) {
		return new Promise<void>(done => setTimeout(() => done(), seconds * 1000));
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

		// close running game if any competitor leaves
		if (player.id == this.competitorOne?.player.id || player.id == this.competitorTwo?.player.id) {
			for (const player of this.players) {
				player.kick();
			}

			this.close();
			return;
		}

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

		if (this.players.length < 2) {
			console.warn(`host ${player.name} tried to start the game alone`);
			return;
		}

		this.competitorOne = new Competitor(this.players[0]);
		this.competitorTwo = new Competitor(this.players[1]);

		this.broadcast({
			start: {
				competitorOne: {
					id: this.competitorOne.player.id
				},
				competitorTwo: {
					id: this.competitorTwo.player.id
				}
			}
		});

		this.isRunning = true;
		console.log(`started game ${this.token}`);

		this.startRound();
	}

	startRound(player?: Player) {
		if (player && !this.isHost(player)) {
			return;
		}

		if (this.currentRound) {
			this.currentRound++;
		} else {
			this.currentRound = 1;
		}

		if (this.currentRound > this.roundCount) {
			return;
		}

		this.competitorOne.restoreHealth();
		this.competitorTwo.restoreHealth();

		this.round = new Round(this.players, this.competitorOne, this.competitorTwo, winner => {
			if (this.currentRound < this.roundCount) {
				this.broadcast({
					endRound: winner
				});
			} else {
				// todo conclude whole game
			}
		});
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