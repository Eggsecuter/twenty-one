import { maxTrumpCards } from "../../shared/constants";
import { OneUpTrumpCard, TrumpCard } from "../../shared/trump-card";
import { Competitor } from "../../shared/competitor";

export class TrumpCardPicker {
	private static readonly trumpCards: Array<{ new (): TrumpCard }> = [
		OneUpTrumpCard
	];

	private static maxDrawChance = 0.5;

	static drawCertain(competitor: Competitor) {
		return this.draw(competitor);
	}

	static drawByChance(competitor: Competitor) {
		return this.draw(competitor, () => {
			const chance = this.maxDrawChance - competitor.storedTrumpCards.length * this.maxDrawChance / maxTrumpCards;
			const roll = Math.random();
			
			return roll < chance;
		});
	}
	
	private static draw(competitor: Competitor, condition: () => boolean = () => true) {
		if (competitor.storedTrumpCards.length >= maxTrumpCards) {
			return;
		}

		if (condition()) {
			const trumpCard = new this.trumpCards[Math.floor(Math.random() * this.trumpCards.length)]();

			if (trumpCard) {
				competitor.storedTrumpCards.push(trumpCard);
				return trumpCard;
			}
		}
	}
}
