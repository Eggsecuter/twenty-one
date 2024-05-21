import { Game } from "./game/game";
import { Player } from "./game/player";
import { ClientMessage } from "../shared/messages";

export function gameManager(app) {
	const games: Game[] = [];

	app.post('/game', async (request, response) => {
		const game = new Game(request.body.roundCount, () => games.splice(games.indexOf(game), 1));
		games.push(game);

		response.json(game.token);
	});

	app.get('/game/:token', async (request, response) => {
		const game = games.find(game => game.token == request.params.token.toLowerCase());

		response.json(!!game);
	});

	app.ws('/join/:token', (socket, request) => {
		const game = games.find(game => game.token == request.params.token.toLowerCase());

		if (!game) {
			return socket.close();
		}

		const player = new Player(socket);

		socket.send(JSON.stringify({
			id: player.id,
			roundCount: game.roundCount,
			peers: game.players,
			competitors: game.isRunning ? {
				competitorOne: {
					id: game.competitorOne.player.id
				},
				competitorTwo: {
					id: game.competitorTwo.player.id
				}
			} : null
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