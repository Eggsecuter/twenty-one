import { maxTrumpCards } from "../../shared/constants";
import { DestroyPlusPlusTrumpCard, DestroyPlusTrumpCard, DestroyTrumpCard, ExchangeTrumpCard, FiveCardTrumpCard, FourCardTrumpCard, GoFor17TrumpCard, GoFor24TrumpCard, GoFor27TrumpCard, LoveYourEnemyTrumpCard, OneUpTrumpCard, PerfectDrawPlusTrumpCard, PerfectDrawTrumpCard, RemoveTrumpCard, ReturnTrumpCard, SevenCardTrumpCard, ShieldPlusTrumpCard, ShieldTrumpCard, SixCardTrumpCard, ThreeCardTrumpCard, TrumpCard, TrumpSwitchPlusTrumpCard, TrumpSwitchTrumpCard, TwoCardTrumpCard, TwoUpPlusTrumpCard, TwoUpTrumpCard, UltimateDrawTrumpCard } from "../../shared/trump-card";

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

	static drawCertain(storedTrumpCardCount: number) {
		return this.draw(storedTrumpCardCount);
	}

	static drawByChance(storedTrumpCardCount: number) {
		const chance = this.maxDrawChance - storedTrumpCardCount * this.maxDrawChance / maxTrumpCards;
		const roll = Math.random();

		if (roll < chance) {
			return this.draw(storedTrumpCardCount);
		}
	}

	private static draw(storedTrumpCardCount: number) {
		if (storedTrumpCardCount >= maxTrumpCards) {
			return;
		}

		const trumpCard = new this.trumpCards[Math.floor(Math.random() * this.trumpCards.length)]();

		if (trumpCard) {
			return trumpCard;
		}
	}
}
