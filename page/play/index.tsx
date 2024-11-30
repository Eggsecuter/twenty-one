import { Component } from "@acryps/page";
import { SocketService } from "../../shared/messages/service";
import { ServerPlayerJoinMessage, ServerPlayerLeaveMessage, ServerInitialJoinMessage } from "../../shared/messages/server";
import { Player } from "../../shared/player";
import { Application } from "..";
import { PlayerConfigurationMessage } from "../../shared/messages/client";
import { ChatComponent } from "./chat";
import { StateComponent } from "./states";
import { ConnectionLostComponent } from "./states/connection-lost";
import { LobbyComponent } from "./states/lobby";
import { NotFoundComponent } from "./states/not-found";

export class PlayComponent extends Component {
	declare parameters: {
		token: string
	};

	player: Player;
	peers: Player[] = [];

	chatComponent: ChatComponent;

	private currentState: StateComponent;

	async onload() {
		// todo if application has no player configuration -> load from local storage and first show player configuration

		if (await this.join()) {
			this.player.socket
				.subscribe(ServerPlayerJoinMessage, message => this.peers.push(message.player))
				.subscribe(ServerPlayerLeaveMessage, message => this.peers.splice(this.peers.findIndex(peer => peer.id == message.player.id), 1));
	
			// prevent tab closing
			window.onbeforeunload = event => event.preventDefault();
	
			this.currentState = new LobbyComponent();
		} else {
			this.currentState = new NotFoundComponent();
		}
	}

	// allow tab closing
	onrouteleave() {
		window.onbeforeunload = () => {};
		this.player.socket.close();
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
					this.player.socket = socketService;
					this.peers = message.peers;

					this.chatComponent = new ChatComponent(message.chatMessages);

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
