import { generateName } from "../../shared/name";
import { characterSources } from "./characters";

export class PlayerConfiguration {
	character: number;
	name: string;

	constructor() {
		const index = Math.floor(Math.random() * characterSources.length);

		this.character = index;
		this.name = generateName();
	}
}
