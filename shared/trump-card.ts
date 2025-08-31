export class TrumpCardEffectHandler {
	constructor (
		public drawCard: (card: number | 'best', opponent: boolean) => void | Promise<void>,
		public returnLastCard: (opponent: boolean) => void | Promise<void>,
		public exchangeLastCards: () => void | Promise<void>,
		public drawTrumpCard: (count: number) => void | Promise<void>,
		public removeStoredTrumpCards: (count: number) => void | Promise<void>,
		public opponentRemoveTrumpCards: (count: number | 'all') => void | Promise<void>
	) {}
}

export abstract class TrumpCard {
	constructor (
		public readonly name: string,
		public readonly description: string,
		public readonly icon: string,
		public readonly permanent: boolean
	) {}

	abstract executeEffect(handler: TrumpCardEffectHandler): Promise<void>;
}

export class OneUpTrumpCard extends TrumpCard {
	constructor() {
		super(
			'One Up',
			`Your opponent\'s bet increases by 1 while this card is on the table. Also, draw 1 trump card.`,
			'one-up',
			true
		);
	}

	async executeEffect(handler: TrumpCardEffectHandler) {
		await handler.drawTrumpCard(1);
	}
}

export class TwoUpTrumpCard extends TrumpCard {
	constructor() {
		super(
			'Two Up',
			`Your opponent\'s bet increases by 2 while this card is on the table. Also, draw 1 trump card.`,
			'two-up',
			true
		);
	}

	async executeEffect(handler: TrumpCardEffectHandler) {
		await handler.drawTrumpCard(1);
	}
}

export class TwoUpPlusTrumpCard extends TrumpCard {
	constructor() {
		super(
			'Two Up +',
			`Return your opponent's last face-up card to the deck. Also, your opponent's bet increases by 2 while this card is on the table.`,
			'two-up-plus',
			true
		);
	}

	async executeEffect(handler: TrumpCardEffectHandler) {
		await handler.returnLastCard(true);
	}
}

export class TwoCardTrumpCard extends TrumpCard {
	constructor() {
		super(
			'2 Card',
			`Draw the 2 card. If it is no longer in the deck, nothing happens.`,
			'two-card',
			false
		);
	}

	async executeEffect(handler: TrumpCardEffectHandler) {
		await handler.drawCard(2, false);
	}
}

export class ThreeCardTrumpCard extends TrumpCard {
	constructor() {
		super(
			'3 Card',
			`Draw the 3 card. If it is no longer in the deck, nothing happens.`,
			'three-card',
			false
		);
	}

	async executeEffect(handler: TrumpCardEffectHandler) {
		await handler.drawCard(3, false);
	}
}

export class FourCardTrumpCard extends TrumpCard {
	constructor() {
		super(
			'4 Card',
			`Draw the 4 card. If it is no longer in the deck, nothing happens.`,
			'four-card',
			false
		);
	}

	async executeEffect(handler: TrumpCardEffectHandler) {
		await handler.drawCard(4, false);
	}
}

export class FiveCardTrumpCard extends TrumpCard {
	constructor() {
		super(
			'5 Card',
			`Draw the 5 card. If it is no longer in the deck, nothing happens.`,
			'five-card',
			false
		);
	}

	async executeEffect(handler: TrumpCardEffectHandler) {
		await handler.drawCard(5, false);
	}
}

export class SixCardTrumpCard extends TrumpCard {
	constructor() {
		super(
			'6 Card',
			`Draw the 6 card. If it is no longer in the deck, nothing happens.`,
			'six-card',
			false
		);
	}

	async executeEffect(handler: TrumpCardEffectHandler) {
		await handler.drawCard(6, false);
	}
}

export class SevenCardTrumpCard extends TrumpCard {
	constructor() {
		super(
			'7 Card',
			`Draw the 7 card. If it is no longer in the deck, nothing happens.`,
			'seven-card',
			false
		);
	}

	async executeEffect(handler: TrumpCardEffectHandler) {
		await handler.drawCard(7, false);
	}
}

export class RemoveTrumpCard extends TrumpCard {
	constructor() {
		super(
			'Remove',
			`Return the last face-up card your opponent drew to the deck.`,
			'remove',
			false
		);
	}

	async executeEffect(handler: TrumpCardEffectHandler) {
		await handler.returnLastCard(true);
	}
}

export class ReturnTrumpCard extends TrumpCard {
	constructor() {
		super(
			'Return',
			`Return the last face-up card you drew to the deck.`,
			'return',
			false
		);
	}

	async executeEffect(handler: TrumpCardEffectHandler) {
		await handler.returnLastCard(false);
	}
}

export class ExchangeTrumpCard extends TrumpCard {
	constructor() {
		super(
			'Exchange',
			`Swap the last cards drawn by you and your opponent. (Face-down cards cannot be swapped.)`,
			'exchange',
			false
		);
	}

	async executeEffect(handler: TrumpCardEffectHandler) {
		await handler.exchangeLastCards();
	}
}

export class TrumpSwitchTrumpCard extends TrumpCard {
	constructor() {
		super(
			'Trump Switch',
			`Discard two of your trump cards at random, then draw three more trump cards. This card can be used even if you posses less than 2 other trump cards.`,
			'trump-switch',
			false
		);
	}

	async executeEffect(handler: TrumpCardEffectHandler) {
		await handler.removeStoredTrumpCards(2);
		await handler.drawTrumpCard(3);
	}
}

export class TrumpSwitchPlusTrumpCard extends TrumpCard {
	constructor() {
		super(
			'Trump Switch +',
			`Discard one of your trump cards at random, then draw four more trump cards. This card can be used even if you posses less than 1 other trump cards.`,
			'trump-switch-plus',
			false
		);
	}

	async executeEffect(handler: TrumpCardEffectHandler) {
		await handler.removeStoredTrumpCards(1);
		await handler.drawTrumpCard(4);
	}
}

export class ShieldTrumpCard extends TrumpCard {
	constructor() {
		super(
			'Shield',
			`Your bet is reduced by 1 while this card is on the table.`,
			'shield',
			true
		);
	}

	async executeEffect(handler: TrumpCardEffectHandler) {}
}

export class ShieldPlusTrumpCard extends TrumpCard {
	constructor() {
		super(
			'Shield +',
			`Your bet is reduced by 2 while this card is on the table.`,
			'shield-plus',
			true
		);
	}

	async executeEffect(handler: TrumpCardEffectHandler) {}
}

export class DestroyTrumpCard extends TrumpCard {
	constructor() {
		super(
			'Destroy',
			`Remove the last trump card your opponent places on the table.`,
			'destroy',
			false
		);
	}

	async executeEffect(handler: TrumpCardEffectHandler) {
		await handler.opponentRemoveTrumpCards(1);
	}
}

export class DestroyPlusTrumpCard extends TrumpCard {
	constructor() {
		super(
			'Destroy +',
			`Remove all your opponent's trump cards from the table.`,
			'destroy-plus',
			false
		);
	}

	async executeEffect(handler: TrumpCardEffectHandler) {
		await handler.opponentRemoveTrumpCards('all');
	}
}

export class DestroyPlusPlusTrumpCard extends TrumpCard {
	constructor() {
		super(
			'Destroy ++',
			`Remove all of your opponent's trump cards from the table. Your opponent cannot use trump cards while this is on the table.`,
			'destroy-plus-plus',
			true
		);
	}

	async executeEffect(handler: TrumpCardEffectHandler) {
		await handler.opponentRemoveTrumpCards('all');
	}
}

export class PerfectDrawTrumpCard extends TrumpCard {
	constructor() {
		super(
			'Perfect Draw',
			`Draw the best possible card from the deck.`,
			'perfect-draw',
			false
		);
	}

	async executeEffect(handler: TrumpCardEffectHandler) {
		await handler.drawCard('best', false);
	}
}

export class PerfectDrawPlusTrumpCard extends TrumpCard {
	constructor() {
		super(
			'Perfect Draw +',
			`Draw the best possible card from the deck. Also, your opponent's bet increases by 5 while this card is on the table.`,
			'perfect-draw-plus',
			true
		);
	}

	async executeEffect(handler: TrumpCardEffectHandler) {
		await handler.drawCard('best', false);
	}
}

export class UltimateDrawTrumpCard extends TrumpCard {
	constructor() {
		super(
			'Ultimate Draw',
			`Draw the best possible card from the deck. Also, draw two trump cards.`,
			'ultimate-draw',
			false
		);
	}

	async executeEffect(handler: TrumpCardEffectHandler) {
		await handler.drawCard('best', false);
		await handler.drawTrumpCard(1);
	}
}

export class GoFor17TrumpCard extends TrumpCard {
	constructor() {
		super(
			'Go For 17',
			`The closest to 17 wins while this card is on the table. Replaces other "Go For" cards that are already on the table.`,
			'go-for-17',
			true
		);
	}

	async executeEffect(handler: TrumpCardEffectHandler) {}
}

export class GoFor24TrumpCard extends TrumpCard {
	constructor() {
		super(
			'Go For 24',
			`The closest to 24 wins while this card is on the table. Replaces other "Go For" cards that are already on the table.`,
			'go-for-24',
			true
		);
	}

	async executeEffect(handler: TrumpCardEffectHandler) {}
}

export class GoFor27TrumpCard extends TrumpCard {
	constructor() {
		super(
			'Go For 27',
			`The closest to 27 wins while this card is on the table. Replaces other "Go For" cards that are already on the table.`,
			'go-for-27',
			true
		);
	}

	async executeEffect(handler: TrumpCardEffectHandler) {}
}

export class LoveYourEnemyTrumpCard extends TrumpCard {
	constructor() {
		super(
			'Love Your Enemy',
			`Your opponent draws the best possible card for them from the deck.`,
			'love-your-enemy',
			false
		);
	}

	async executeEffect(handler: TrumpCardEffectHandler) {
		await handler.drawCard('best', true);
	}
}
