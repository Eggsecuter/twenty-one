import { Component } from "@acryps/page";
import { AnonymousTrumpCard } from "../../../../../shared/messages/server";
import { activateTrumpCardDuration, dealCardDuration } from "./index.style";

export class CardComponent extends Component {
	private dealt = false;
	private flipped = false;

	get isTrumpCard() {
		return this.card == 'hidden' || this.isActiveTrumpCard;
	}

	get isActiveTrumpCard() {
		return this.card != null && typeof this.card == 'object';
	}

	constructor (
		private card: number | AnonymousTrumpCard
	) {
		super();
	}

	deal() {
		this.dealt = true;
		return this;
	}

	flip() {
		this.flipped = true;
		return this;
	}

	render() {
		const element = <ui-card ui-trump={this.isTrumpCard} ui-deal={this.dealt} ui-flip={this.flipped}>
			<ui-face ui-front>
				<img src={this.getCardFrontSource()} />
			</ui-face>
			<ui-face ui-back>
				<img src='/assets/cards/back.png' />
			</ui-face>
		</ui-card>;

		if (this.dealt) {
			const animation = this.isActiveTrumpCard ? activateTrumpCardDuration : dealCardDuration;
			setTimeout(() => element.removeAttribute('ui-deal'), +animation.value * 1000);
		}

		return element;
	}

	private getCardFrontSource() {
		// show back on both sides if unknown for player
		if (this.card == null || this.card == 'hidden') {
			return '/assets/cards/back.png';
		}

		if (typeof this.card == 'number') {
			return `/assets/cards/${this.card}.png`;
		}

		return `/assets/trump-cards/${this.card.icon}.webp`;
	}
}
