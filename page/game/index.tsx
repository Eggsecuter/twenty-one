import { Component } from "@acryps/page";
import { Player } from "./player";
import { LobbyComponent } from "./lobby";
import { ServerMessage } from "../../shared/messages";
import { BoardComponent } from "./board";

export class GameComponent extends Component {
	declare parameters: { token };
	declare rootNode: HTMLElement;

	id: string;
	players: Player[] = [];
	socket: WebSocket;

	private screen = new LobbyComponent();

	get board() {
		return this.screen as BoardComponent;
	}

	get player() {
		return this.players.find(player => player.id == this.id);
	}

	get isHost() {
		return this.players.findIndex(player => player.id == this.id) == 0;
	}

	onrouteleave() {
		this.socket.close();
	}

	async onload() {
		this.socket = new WebSocket(`${location.protocol.replace('http', 'ws')}//${location.host}/join/${this.parameters.token}`);
		this.socket.onclose = () => this.navigate('/');

		this.socket.onmessage = event => {
			const join = JSON.parse(event.data);
			this.id = join.id;
			this.players = join.peers.map(player => Player.from(player));

			this.socket.onmessage = event => {
				const data = JSON.parse(event.data) as ServerMessage;

				if ('join' in data) {
					this.players.push(Player.from(data.join));

					this.screen.update();
				}

				if ('leave' in data) {
					const playerIndex = this.players.findIndex(player => player.id == Player.from(data.leave).id);
					this.players.splice(playerIndex, 1);

					this.screen.update();
				}

				if ('start' in data) {
					this.screen = new BoardComponent(data.start);
					this.update();
				}

				if ('stop' in data) {
					
				}
			};
		};
	}

	render() {
		return <ui-game>
			{this.screen}
		</ui-game>;
	}
}