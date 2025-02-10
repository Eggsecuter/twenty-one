import { maxTrumpCards } from "../../shared/constants";
import { OneUpTrumpCard, TrumpCard } from "../../shared/trump-card";
import { PlayerState } from "./player-state";

export class TrumpCardPicker {
	// todo add rarity
	private static readonly trumpCards: Array<{ new (): TrumpCard }> = [
		OneUpTrumpCard
	];

	private static maxDrawChance = 0.5;

	static drawCertain(state: PlayerState) {
		return this.draw(state);
	}

	static drawByChance(state: PlayerState) {
		return this.draw(state, () => {
			const chance = this.maxDrawChance - state.storedTrumpCards.length * this.maxDrawChance / maxTrumpCards;
			const roll = Math.random();
			
			return roll < chance;
		});
	}
	
	private static draw(state: PlayerState, condition: () => boolean = () => true) {
		if (state.storedTrumpCards.length >= maxTrumpCards) {
			return;
		}

		if (condition()) {
			const trumpCard = new this.trumpCards[Math.floor(Math.random() * this.trumpCards.length)]();

			if (trumpCard) {
				state.storedTrumpCards.push(trumpCard);
				return trumpCard;
			}
		}
	}
}
