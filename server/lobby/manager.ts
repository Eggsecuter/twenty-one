import { Lobby } from "./lobby";
import { SocketService } from "../../shared/messages/service";
import { ServerInitialJoinMessage } from "../../shared/messages/server";
import { PlayerConfigurationMessage } from "../../shared/messages/client";
import { getDeviceId } from "..";
import { PlayerConnection } from "./player-connection";
import { Player } from "../../shared/player";

export class LobbyManager {
	private lobbies: Lobby[] = [];

	constructor (app) {
		app.post('/lobby', async (_, response) => {
			const token = this.create();

			response.json(token);
		});

		app.get('/lobby/:token', async (request, response) => {
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
				lobby => this.join(lobby, socket, deviceId),
				() => socket.close()
			);
		});
	}

	private checkJoinPossibility(token: string, deviceId: string, resolve: (lobby: Lobby) => void, reject: (error: string) => void): void {
		const lobby = this.lobbies.find(lobby => lobby.token == token.toLowerCase());

		if (!lobby) {
			reject(`Lobby does not exist.`);
		} else if (lobby.kickedDeviceIds.includes(deviceId)) {
			reject(`You've been kicked from this lobby.`);
		} else if (lobby.isFull) {
			reject(`Lobby is full.`);
		} else {
			resolve(lobby);
		}
	}

	private create() {
		const lobby = new Lobby(() => this.lobbies.splice(this.lobbies.indexOf(lobby), 1));
		this.lobbies.push(lobby);

		return lobby.token;
	}

	private join(lobby: Lobby, socket: WebSocket, deviceId: string) {
		const socketService = new SocketService(socket);

		// player information must be sent separately
		socketService.subscribe(PlayerConfigurationMessage, message => {
			const playerConnection = new PlayerConnection(new Player(message.character, message.name), socketService, deviceId);

			// send joined player initial data
			playerConnection.socket.send(new ServerInitialJoinMessage(
				playerConnection.player,
				lobby.playerConnections.map(peer => peer.player),
				lobby.chatMessages,
				lobby.settings
			));

			// broadcasts to each peer and add the player to the list afterwards
			lobby.join(playerConnection);

			socket.onclose = () => lobby.leave(playerConnection);
		});
	}
}
