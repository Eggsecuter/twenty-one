import { Player } from "./player";
import { ServerMessage } from "../../shared/messages";
import { generateToken } from "../../shared/token";

export class Game {
	readonly ticksPerSecond = 30;
	readonly tickMillisecondsInterval = 1 / this.ticksPerSecond * 1000;

	readonly token: string;
	
	players: Player[] = [];

	private gameLoop: NodeJS.Timeout;

	get isRunning() {
		return !!this.gameLoop;
	}

	constructor(
		private onclose: () => void
	) {
		this.players = [];
		this.token = generateToken();

		console.log(`game "${this.token}" created`);
	}

	join(player: Player) {
		if (this.gameLoop) {
			console.warn(`user ${player.name} tried to join running game ${this.token}`);
			throw new Error();
		}

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

		let lastTick = Date.now();

		this.gameLoop = setInterval(() => {
			if (Date.now() > lastTick + this.tickMillisecondsInterval) {
				const deltaTime = (Date.now() - lastTick) / 1000;

				// update

				lastTick = Date.now();
			}
		});

		console.log(`started game ${this.token}`);
	}

	private stop() {
		if (this.gameLoop) {
			clearInterval(this.gameLoop);

			this.broadcast({
				stop: true
			});

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
			player.socket.send(JSON.stringify(message));
		}
	}
}