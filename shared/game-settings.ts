export const roundCountOptions = [1, 3, 5];
export const playerHealthOptions = [3, 5, 10];

export class GameSettings {
	constructor (
		public roundCount = 3,
		public playerHealth = 5
	) {}
}
