import { maxTrumpCards } from "../../shared/constants";
import { DestroyPlusPlusTrumpCard, DestroyPlusTrumpCard, DestroyTrumpCard, ExchangeTrumpCard, FiveCardTrumpCard, FourCardTrumpCard, GoFor17TrumpCard, GoFor24TrumpCard, GoFor27TrumpCard, LoveYourEnemyTrumpCard, OneUpTrumpCard, PerfectDrawPlusTrumpCard, PerfectDrawTrumpCard, RemoveTrumpCard, ReturnTrumpCard, SevenCardTrumpCard, ShieldPlusTrumpCard, ShieldTrumpCard, SixCardTrumpCard, ThreeCardTrumpCard, TrumpCard, TrumpSwitchPlusTrumpCard, TrumpSwitchTrumpCard, TwoCardTrumpCard, TwoUpPlusTrumpCard, TwoUpTrumpCard, UltimateDrawTrumpCard } from "../../shared/trump-card";
import { Competitor } from "../../shared/competitor";

export class TrumpCardPicker {
	private static readonly trumpCards: Array<{ new (): TrumpCard }> = [
		OneUpTrumpCard,
		TwoUpTrumpCard,
		TwoUpPlusTrumpCard,
		TwoCardTrumpCard,
		ThreeCardTrumpCard,
		FourCardTrumpCard,
		FiveCardTrumpCard,
		SixCardTrumpCard,
		SevenCardTrumpCard,
		RemoveTrumpCard,
		ReturnTrumpCard,
		ExchangeTrumpCard,
		TrumpSwitchTrumpCard,
		TrumpSwitchPlusTrumpCard,
		ShieldTrumpCard,
		ShieldPlusTrumpCard,
		DestroyTrumpCard,
		DestroyPlusTrumpCard,
		DestroyPlusPlusTrumpCard,
		PerfectDrawTrumpCard,
		PerfectDrawPlusTrumpCard,
		UltimateDrawTrumpCard,
		GoFor17TrumpCard,
		GoFor24TrumpCard,
		GoFor27TrumpCard,
		LoveYourEnemyTrumpCard
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
