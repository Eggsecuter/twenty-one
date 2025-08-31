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

	static forceDraw() {
		return this.draw();
	}

	static drawCertain(storedTrumpCardCount: number) {
		if (storedTrumpCardCount >= maxTrumpCards) {
			return;
		}

		return this.draw();
	}

	static drawByChance(storedTrumpCardCount: number) {
		if (storedTrumpCardCount >= maxTrumpCards) {
			return;
		}

		const chance = this.maxDrawChance - storedTrumpCardCount * this.maxDrawChance / maxTrumpCards;
		const roll = Math.random();

		if (roll < chance) {
			return this.draw();
		}
	}

	private static draw() {
		const trumpCard = new this.trumpCards[Math.floor(Math.random() * this.trumpCards.length)]();

		if (trumpCard) {
			return trumpCard;
		}
	}
}
