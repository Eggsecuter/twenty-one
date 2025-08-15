import { Component } from "@acryps/page";
import { SocketService } from "../../shared/messages/service";
import { ServerPlayerJoinMessage, ServerPlayerLeaveMessage, ServerInitialJoinMessage, ServerKickMessage, ServerGameStartMessage, ServerGameEndMessage } from "../../shared/messages/server";
import { Player } from "../../shared/player";
import { Application } from "..";
import { PlayerConfigurationMessage } from "../../shared/messages/client";
import { ChatComponent } from "./chat";
import { StateComponent } from "./states";
import { ConnectionLostComponent } from "./states/connection-lost";
import { LobbyComponent } from "./states/lobby";
import { JoinErrorComponent } from "./states/join-error";
import { LocalStorage } from "../shared/local-storage";
import { DirectJoinComponent } from "./states/direct-join";
import { GameSettings } from "../../shared/game-settings";
import { KickedComponent } from "./states/kicked";
import { GameComponent } from "./states/game";

export class PlayComponent extends Component {
	declare parameters: {
		token: string
	};

	players: Player[] = [];
	player: Player;
	socket: SocketService;

	chatComponent: ChatComponent;
	gameSettings: GameSettings;

	private currentState: StateComponent;

	async onload() {
		const response = await Application.get(`/lobby/${this.parameters.token}`);

		if (response.error) {
			this.currentState = new JoinErrorComponent(response.error);
		} else if (!Application.playerConfiguration) { // joining directly through link
			this.currentState = new DirectJoinComponent();
		} else if (await this.join()) {
			this.loadLobby();
		} else {
			this.currentState = new JoinErrorComponent('An unexpected error occurred while joining.');
		}
	}

	onrouteleave() {
		this.socket?.close();
	}

	isHost(player = this.player) {
		return this.players.indexOf(player) == 0;
	}

	reloadAfterError() {
		this.remove();

		// allows to reconnect directly without reentering the information
		const playerConfiguration = Application.playerConfiguration;

		// this is merely for visual feedback for the user due to the page reloading "too fast"
		setTimeout(() => {
			location.reload();

			Application.playerConfiguration = playerConfiguration;
		}, 100);
	}

	render() {
		return <ui-play>
			{this.currentState}
		</ui-play>;
	}

	private async join() {
		const socket = new WebSocket(`${location.protocol.replace('http', 'ws')}//${location.host}/join/${this.parameters.token}`);
		const socketService = new SocketService(socket);

		return await new Promise<boolean>(async done => {
			socket.onclose = () => done(false);

			socket.onopen = async () => {
				socketService.send(new PlayerConfigurationMessage(Application.playerConfiguration.character, Application.playerConfiguration.name));

				// wait for join confirmation to subscribe to any other events
				socketService.subscribe(ServerInitialJoinMessage, message => {
					this.player = message.player;
					this.socket = socketService;

					this.players = [...message.peers, this.player];

					this.chatComponent = new ChatComponent(message.chatMessages);
					this.gameSettings = message.gameSettings;

					socket.onclose = () => this.switchState(new ConnectionLostComponent());

					done(true);
				});
			}
		});
	}

	private loadLobby() {
		// save after join was successful
		LocalStorage.setPlayerConfiguration(Application.playerConfiguration);

		this.socket.subscribe(ServerPlayerJoinMessage, message => {
			this.players.push(message.player);
			this.currentState.onplayerschange();
		});

		this.socket.subscribe(ServerPlayerLeaveMessage, message => {
			this.players.splice(this.players.findIndex(player => player.id == message.player.id), 1);
			this.currentState.onplayerschange();
		});

		this.socket.subscribe(ServerKickMessage, message => {
			if (message.player.id == this.player.id) {
				this.switchState(new KickedComponent());
			} else {
				this.players.splice(this.players.findIndex(player => player.id == message.player.id), 1);
				this.currentState.onplayerschange();
			}
		});

		this.socket.subscribe(ServerGameStartMessage, () => {
			this.switchState(new GameComponent(
				() => this.switchState(new LobbyComponent())
			));
		});

		this.socket.subscribe(ServerGameEndMessage, () => {
			this.switchState(new LobbyComponent());
		});

		this.currentState = new LobbyComponent();
	}

	private switchState(component: StateComponent) {
		this.currentState.onunsubscribe(this.socket);

		this.currentState = component;
		this.update();
	}
}
