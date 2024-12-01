import { Game } from "./game";
import { SocketService } from "../../shared/messages/service";
import { Player } from "../../shared/player";
import { ServerInitialJoinMessage } from "../../shared/messages/server";
import { PlayerConfigurationMessage } from "../../shared/messages/client";

export class GameManager {
	private games: Game[] = [];

	constructor (app) {
		app.post('/game', async (_, response) => {
			const token = this.create();

			response.json(token);
		});

		app.get('/game/:token', async (request, response) => {
			const game = this.find(request.params.token.toLowerCase());

			response.json(!!game);
		});

		app.ws('/join/:token', (socket, request) => {
			const game = this.find(request.params.token.toLowerCase());
	
			if (game) {
				this.join(game, socket);
			} else {
				socket.close();
			}
		});
	}

	private find(token: string) {
		return this.games.find(game => game.token == token);
	}

	private create() {
		const game = new Game(() => this.games.splice(this.games.indexOf(game), 1));
		this.games.push(game);

		return game.token;
	}

	private join(game: Game, socket: WebSocket) {
		const socketService = new SocketService(socket);

		// player information must be sent separately
		socketService.subscribe(PlayerConfigurationMessage, message => {
			const player = new Player(socketService, message.character, message.name);

			// send joined player initial data
			player.socket.send(new ServerInitialJoinMessage(player, game.players, game.chatMessages, game.settings));

			// broadcasts to each peer and add the player to the list afterwards
			game.join(player);

			socket.onclose = () => game.leave(player);
		});
	}
}
