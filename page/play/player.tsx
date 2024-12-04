import { Component } from "@acryps/page";
import { characterSources } from "../shared/characters-sources";
import { Player } from "../../shared/player";
import { PlayComponent } from ".";
import { ClientKickMessage } from "../../shared/messages/client";

export class PlayerComponent extends Component {
	declare rootNode: HTMLElement;

	private menuOpen: boolean;
	// cache to prevent obsoletely refetching image
	private avatarImage: HTMLImageElement;

	constructor (
		private playComponent: PlayComponent,
		private player: Player
	) {
		super();
	}

	render() {
		const currentIsHost = this.playComponent.players.indexOf(this.player) == 0;
		const canOpenMenu = !this.menuOpen && !currentIsHost && this.playComponent.isHost;

		return <ui-player ui-clickable={canOpenMenu} ui-click={() => {
			if (canOpenMenu) {
				this.menuOpen = true;
				document.addEventListener('mouseup', this.handleClickOutside.bind(this));

				this.update();
			}
		}}>
			<ui-avatar>
				{this.avatarImage = this.avatarImage ?? <img src={characterSources[this.player.character]} />}
			</ui-avatar>

			<ui-name>
				{currentIsHost && '[Host] '}
				{this.player.name}
			</ui-name>

			{this.menuOpen && <ui-menu>
				<ui-action ui-secondary ui-click={() => {
					this.playComponent.socket.send(new ClientKickMessage(this.player));
					this.closeMenu();
				}}>Kick</ui-action>

				<ui-action ui-click={() => this.closeMenu()}>Cancel</ui-action>
			</ui-menu>}
		</ui-player>;
	}

	// close menu when clicked outside
	private handleClickOutside(event: MouseEvent) {
		if (!this.rootNode.contains(event.target as HTMLElement)) {
			this.closeMenu();
		}
	}

	private closeMenu() {
		document.removeEventListener('mouseup', this.handleClickOutside);
		this.menuOpen = false;
		this.update();
	}
}
