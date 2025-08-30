import { generateToken } from "./token";

export class Player {
	id: string;

	constructor (
		public character: number,
		public name: string
	) {
		this.id = generateToken();
	}
}
