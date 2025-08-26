import { Component } from "@acryps/page";
import { TrumpCard } from "../../../../../shared/trump-card";
import { Player } from "../../../../../shared/player";

export class TrumpCardDialogComponent extends Component {
	declare rootNode: HTMLElement;

	private trumpCard: TrumpCard;
	private player: Player;

	private resolvePresent?: () => void;

	async present(trumpCard: TrumpCard, player?: Player) {
		this.trumpCard = trumpCard;
		this.player = player;
		this.update();

		return new Promise<void>(done => this.resolvePresent = done);
	}

	close() {
		this.trumpCard = null;
		this.player = null;
		this.update();

		if (this.resolvePresent) {
			this.resolvePresent();
			this.resolvePresent = null;
		}
	}

	render() {
		if (!this.trumpCard) {
			return <ui-trump-card-dialog></ui-trump-card-dialog>;
		}

		return <ui-trump-card-dialog ui-active ui-click={() => this.close()}>
			<ui-trump-card>
				<ui-title>{this.player ? `${this.player.name} played` : `You received`}</ui-title>

				<ui-icon>
					<img src={`/assets/trump-cards/${this.trumpCard.icon}.webp`} />
				</ui-icon>

				<ui-name>{this.trumpCard.name}</ui-name>
				<ui-description>{this.trumpCard.description}</ui-description>
			</ui-trump-card>
		</ui-trump-card-dialog>;
	}
}
