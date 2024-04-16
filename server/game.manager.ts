import { Game } from "./game/game";
import { Player } from "./game/player";
import { ClientMessage } from "../shared/messages";

export function gameManager(app) {
	const games: Game[] = [];

	app.post('/game', async (_, response) => {
		const game = new Game(() => games.splice(games.indexOf(game), 1));
		games.push(game);

		response.json(game.token);
	});

	app.get('/game/:token', async (request, response) => {
		const game = games.find(game => game.token == request.params.token.toLowerCase());

		// only join existing open lobbies
		if (!game) {
			response.json(false);
		} else {
			response.json(!game.isRunning);
		}
	});

	app.ws('/join/:token', (socket, request) => {
		const game = games.find(game => game.token == request.params.token.toLowerCase());

		if (!game) {
			return socket.close();
		}

		const player = new Player(socket);

		socket.send(JSON.stringify({
			id: player.id,
			peers: game.players
		}));

		try {
			game.join(player);
		} catch (error) {
			socket.close();
		}

		socket.on('message', data => {
			const message: ClientMessage = JSON.parse(data);

			if (message.start) {
				game.start(player);
			}

			if (message.draw) {
				game.round.draw(player);
			}

			if (message.stay) {
				game.round.stay(player);
			}
		});

		socket.onclose = () => game.leave(player);
	});
}