import { Component } from "@acryps/page";
import { toDataURL } from 'qrcode';
import { GameComponent } from ".";

export class LobbyComponent extends Component {
	declare parent: GameComponent;

	render() {
		let qrCodeImage = new Image();

		requestAnimationFrame(async () => {
			qrCodeImage.src = await toDataURL(`${location.protocol}//${location.host}/play/${this.parent.parameters.token}`, {
				margin: 0
			});
		});

		return <ui-lobby>
			<ui-invite>
				{qrCodeImage}

				<ui-token>
					{this.parent.parameters.token}
				</ui-token>
			</ui-invite>

			<ui-players>
				{this.parent.players.map((player, index) => <ui-player ui-self={player == this.parent.player} ui-index={index} style={`--color: ${player.color}`}>
					<ui-name>{player.name}</ui-name>
					{index == 0 && <ui-host>Host</ui-host>}
				</ui-player>)}
			</ui-players>

			<ui-actions>
				{this.parent.isHost ? <ui-action ui-start ui-disabled={this.parent.players.length < 2} ui-click={event => {
					if (this.parent.players.length >= 2) {
						this.parent.send({
							start: true
						});
	
						const element = (event.target as HTMLElement);
						element.innerText = 'Starting ...';
						element.setAttribute('ui-click-pending', '');
					}
				}}>
					{this.parent.players.length >= 2 ? 'Start Game' : 'Waiting for others ...'}
				</ui-action> : <ui-action ui-disabled>Waiting for host ...</ui-action>}

				<ui-secondary-action ui-leave ui-href='/'>Leave</ui-secondary-action>
			</ui-actions>
		</ui-lobby>;
	}
}