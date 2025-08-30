export abstract class TrumpCard {
	constructor (
		public readonly name: string,
		public readonly description: string,
		public readonly icon: string,
		public readonly permanent: boolean
	) {}
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
}
