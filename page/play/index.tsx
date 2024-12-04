import { Component } from "@acryps/page";
import { SocketService } from "../../shared/messages/service";
import { ServerPlayerJoinMessage, ServerPlayerLeaveMessage, ServerInitialJoinMessage, ServerKickMessage } from "../../shared/messages/server";
import { Player } from "../../shared/player";
import { Application } from "..";
import { PlayerConfigurationMessage } from "../../shared/messages/client";
import { ChatComponent } from "./chat";
import { StateComponent } from "./states";
import { ConnectionLostComponent } from "./states/connection-lost";
import { LobbyComponent } from "./states/lobby";
import { NotFoundComponent } from "./states/not-found";
import { LocalStorage } from "../shared/local-storage";
import { DirectJoinComponent } from "./states/direct-join";
import { GameSettings } from "../../shared/game-settings";

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

	get isHost() {
		return this.players.indexOf(this.player) == 0;
	}

	async onload() {
		// joining directly through link
		if (!Application.playerConfiguration) {
			this.currentState = new DirectJoinComponent();
		} else if (await this.join()) {
			// save after join was successful
			LocalStorage.setPlayerConfiguration(Application.playerConfiguration);

			this.socket
				.subscribe(ServerPlayerJoinMessage, message => {
					this.players.push(message.player);
					this.currentState.onplayerschange();
				})
				.subscribe(ServerPlayerLeaveMessage, message => {
					this.players.splice(this.players.findIndex(player => player.id == message.player.id), 1);
					this.currentState.onplayerschange();
				})
				.subscribe(ServerKickMessage, message => {
					if (message.player.id == this.player.id) {
						// todo handle kick
						console.debug(`You've been kicked by the host.`);
						this.navigate('');
					} else {
						this.players.splice(this.players.findIndex(player => player.id == message.player.id), 1);
						this.currentState.onplayerschange();
					}
				});

			// prevent tab closing
			window.onbeforeunload = event => event.preventDefault();

			this.currentState = new LobbyComponent();
		} else {
			this.currentState = new NotFoundComponent();
		}
	}

	onrouteleave() {
		// allow tab closing
		window.onbeforeunload = () => {};
		this.socket?.close();
	}

	render() {
		return <ui-game>
			{this.currentState}
		</ui-game>;
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

	private switchState(component: StateComponent) {
		this.currentState = component;
		this.update();
	}
}
