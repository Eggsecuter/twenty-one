export abstract class TrumpCard {
	constructor (
		public readonly name: string,
		public readonly description: string,
		public readonly icon: string // todo add icons in assets
	) {}

	abstract activate(): void;
	abstract remove(): void;
}

export class OneUpTrumpCard extends TrumpCard {
	constructor() {
		super(
			'One-Up',
			'Your opponent\'s bet increases by 1 while this card is on the table. Also, draw 1 trump card.',
			'one-up'
		);
	}

	activate() {
		
	}

	remove() {
		
	}
}
