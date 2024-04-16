import { Component } from "@acryps/page";
import { Player } from "./player";
import { LobbyComponent } from "./lobby";
import { ClientMessage, ServerMessage } from "../../shared/messages";
import { BoardComponent } from "./board";

export class GameComponent extends Component {
	declare parameters: { token };
	declare rootNode: HTMLElement;

	playerId: string;
	players: Player[] = [];
	socket: WebSocket;

	private screen = new LobbyComponent();

	get board() {
		return this.screen as BoardComponent;
	}

	get player() {
		return this.players.find(player => player.id == this.playerId);
	}

	get isHost() {
		return this.players.findIndex(player => player.id == this.playerId) == 0;
	}

	onrouteleave() {
		this.socket.close();
	}

	async onload() {
		this.socket = new WebSocket(`${location.protocol.replace('http', 'ws')}//${location.host}/join/${this.parameters.token}`);
		this.socket.onclose = () => this.navigate('/');

		this.socket.onmessage = event => {
			const join = JSON.parse(event.data);
			this.playerId = join.id;
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
					const competitorOne = this.players.find(player => player.id == data.start.competitorOne.id);
					const competitorTwo = this.players.find(player => player.id == data.start.competitorTwo.id);

					// defaults to competitor one being in front
					// competitor two in front if it's the local player
					if (this.playerId == competitorTwo.id) {
						this.screen = new BoardComponent(competitorTwo, competitorOne);
					} else {
						this.screen = new BoardComponent(competitorOne, competitorTwo);
					}

					this.update();
				}

				if ('stop' in data) {
					
				}
			};
		};
	}

	send(message: ClientMessage) {
		this.socket.send(JSON.stringify(message));
	}

	render() {
		return <ui-game>
			{this.screen}
		</ui-game>;
	}
}