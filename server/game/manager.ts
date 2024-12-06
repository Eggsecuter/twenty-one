import { Game } from "./game";
import { SocketService } from "../../shared/messages/service";
import { ServerInitialJoinMessage } from "../../shared/messages/server";
import { PlayerConfigurationMessage } from "../../shared/messages/client";
import { getDeviceId } from "..";
import { PlayerConnection } from "./player-connection";
import { Player } from "../../shared/player";

export class GameManager {
	private games: Game[] = [];

	constructor (app) {
		app.post('/game', async (_, response) => {
			const token = this.create();

			response.json(token);
		});

		app.get('/game/:token', async (request, response) => {
			this.checkJoinPossibility(
				request.params.token,
				getDeviceId(request),
				() => response.json({}),
				error => response.json({ error })
			);
		});

		app.ws('/join/:token', (socket, request) => {
			const deviceId = getDeviceId(request);
			
			// rejects only if user tries to crack it by directly opening a websocket
			this.checkJoinPossibility(
				request.params.token,
				deviceId,
				game => this.join(game, socket, deviceId),
				() => socket.close()
			);
		});
	}

	private checkJoinPossibility(token: string, deviceId: string, resolve: (game: Game) => void, reject: (error: string) => void): void {
		const game = this.games.find(game => game.token == token.toLowerCase());

		if (!game) {
			reject(`Lobby does not exist.`);
		} else if (game.kickedDeviceIds.includes(deviceId)) {
			reject(`You've been kicked from this lobby.`);
		} else if (game.isFull) {
			reject(`Lobby is full.`);
		} else {
			resolve(game);
		}
	}

	private create() {
		const game = new Game(() => this.games.splice(this.games.indexOf(game), 1));
		this.games.push(game);

		return game.token;
	}

	private join(game: Game, socket: WebSocket, deviceId: string) {
		const socketService = new SocketService(socket);

		// player information must be sent separately
		socketService.subscribe(PlayerConfigurationMessage, message => {
			const playerConnection = new PlayerConnection(new Player(message.character, message.name), socketService, deviceId);

			// send joined player initial data
			playerConnection.socket.send(new ServerInitialJoinMessage(
				playerConnection.player,
				game.playerConnections.map(peer => peer.player),
				game.chatMessages,
				game.settings
			));

			// broadcasts to each peer and add the player to the list afterwards
			game.join(playerConnection);

			socket.onclose = () => game.leave(playerConnection);
		});
	}
}
