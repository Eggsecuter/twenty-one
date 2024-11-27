import { Component } from "@acryps/page";
import { SocketService } from "../../shared/messages/service";
import { ServerPlayerJoinMessage, ServerPlayerLeaveMessage, ServerInitialJoinMessage } from "../../shared/messages/server";
import { Player } from "../../shared/player";
import { Application } from "..";
import { PlayerConfigurationMessage } from "../../shared/messages/client";
import { ChatComponent } from "./chat";

export class PlayComponent extends Component {
	declare parameters: {
		token: string
	};

	player: Player;
	peers: Player[] = [];

	private chatComponent: ChatComponent;

	async onload() {
		// todo if application has no player configuration -> load from local storage and first show player configuration

		const socket = new WebSocket(`${location.protocol.replace('http', 'ws')}//${location.host}/join/${this.parameters.token}`);
		// todo navigate to connection lost page
		socket.onclose = () => this.navigate('/');

		// send player configuration separately
		const socketService = new SocketService(socket);

		await new Promise<void>(done => socket.onopen = () => done());

		socketService.send(new PlayerConfigurationMessage(Application.playerConfiguration.character, Application.playerConfiguration.name));

		// wait for join confirmation to subscribe to any other events
		await new Promise<void>(done => socketService.subscribe(ServerInitialJoinMessage, message => {
			this.player = message.player;
			this.player.socket = socketService;

			this.peers = message.peers;

			this.chatComponent = new ChatComponent(message.chatMessages);

			done();
		}));

		this.player.socket
			.subscribe(ServerPlayerJoinMessage, message => this.peers.push(message.player))
			.subscribe(ServerPlayerLeaveMessage, message => this.peers.splice(this.peers.findIndex(peer => peer.id == message.player.id), 1));

		// prevent tab closing
		window.onbeforeunload = event => event.preventDefault();
	}

	// allow tab closing
	onrouteleave() {
		window.onbeforeunload = () => {};
		this.player.socket.close();
	}

	render() {
		return <ui-game>
			{this.chatComponent}
		</ui-game>;
	}
}
