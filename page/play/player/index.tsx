import { Component } from "@acryps/page";
import { characterSources } from "../../shared/characters-sources";
import { Player } from "../../../shared/player";
import { PlayComponent } from "..";
import { ClientKickMessage } from "../../../shared/messages/client";
import { registerDismissible } from "../../shared/dismissible";
import { crownIcon } from "../../built/icons";

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
		const currentIsHost = this.playComponent.isHost(this.player);
		const canOpenMenu = !this.menuOpen && !currentIsHost && this.playComponent.isHost();

		requestAnimationFrame(() => {
			registerDismissible(() => this.rootNode, () => this.menuOpen, () => {
				if (canOpenMenu) {
					this.menuOpen = true;
					this.update();
				}
			}, () => this.closeMenu());
		});

		return <ui-player ui-can-open-menu={canOpenMenu}>
			<ui-avatar>
				{currentIsHost && crownIcon()}
				{this.avatarImage = this.avatarImage ?? <img src={characterSources[this.player.character]} />}
			</ui-avatar>

			<ui-name>{this.player.name}</ui-name>

			{this.menuOpen && <ui-menu>
				<ui-action ui-secondary ui-click={() => {
					this.playComponent.socket.send(new ClientKickMessage(this.player));
					this.closeMenu();
				}}>Kick</ui-action>

				<ui-action ui-click={() => this.closeMenu()}>Cancel</ui-action>
			</ui-menu>}
		</ui-player>;
	}

	private closeMenu() {
		this.menuOpen = false;
		this.update();
	}
}
