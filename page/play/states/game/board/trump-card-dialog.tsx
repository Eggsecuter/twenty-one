import { Component } from "@acryps/page";
import { TrumpCard } from "../../../../../shared/trump-card";
import { Player } from "../../../../../shared/player";
import { inspectTrumpCardTiltX, inspectTrumpCardTiltY } from "./index.style";
import { deg } from "@acryps/style";
import { Application } from "../../../..";

export class TrumpCardDialogComponent extends Component {
	declare rootNode: HTMLElement;

	private trumpCard: TrumpCard;
	private player: Player;

	private readonly maxTiltDegree = 30;

	private resolvePresent?: () => void;

	async present(trumpCard: TrumpCard, player?: Player) {
		this.trumpCard = trumpCard;
		this.player = player;
		this.update();

		Application.playSound('show-trump-card');

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

		requestAnimationFrame(() => {
			this.rootNode.onmousemove = (event: MouseEvent) => {
				const halfWidth = window.innerWidth / 2;
				const halfHeight = window.innerHeight / 2;

				// rotation axis is the same as position axis -> height is x tilt and width is y tilt
				const xTilt = -this.maxTiltDegree * (event.y - halfHeight) / halfHeight;
				const yTilt = this.maxTiltDegree * (event.x - halfWidth) / halfWidth;

				inspectTrumpCardTiltX.update(deg(xTilt));
				inspectTrumpCardTiltY.update(deg(yTilt));
			}
		});

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
