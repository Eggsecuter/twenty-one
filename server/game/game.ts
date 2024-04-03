import { Player } from "./player";
import { ServerMessage } from "../../shared/messages";
import { generateToken } from "../../shared/token";
import { Deck } from "./deck";

export class Game {
	readonly token: string;

	players: Player[];
	isRunning: boolean;

	private deck: Deck;

	get playerOne() {
		return this.players[0];
	}

	get playerTwo() {
		return this.players[1];
	}

	get spectators() {
		return this.players.slice(2);
	}

	constructor(
		private onclose: () => void
	) {
		this.token = generateToken();
		this.players = [];
		this.isRunning = false;

		console.log(`game "${this.token}" created`);
	}

	join(player: Player) {
		if (this.isRunning) {
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

		this.isRunning = true;
		console.log(`started game ${this.token}`);

		this.initializeRound();
	}

	async initializeRound() {
		this.deck = new Deck();

		this.deck.draw(this.playerOne);
		await this.sleep(0.5);
		this.deck.draw(this.playerTwo);
		await this.sleep(0.5);
		this.deck.draw(this.playerOne);
		await this.sleep(0.5);
		this.deck.draw(this.playerTwo);
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
			player.socket.send(JSON.stringify(message));
		}
	}

	private sleep(seconds: number) {
		return new Promise<void>(done => setTimeout(() => done(), seconds * 1000));
	}
}