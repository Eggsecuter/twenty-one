import { generateToken } from "../../shared/token";

const characters: string[] = [
	"Ethan Winters",
	"Mia Winters",
	"Jack Baker",
	"Marguerite Baker",
	"Lucas Baker",
	"Zoe Baker",
	"Eveline (E-001)",
	"Clancy Jarvis",
	"Andre Stickland",
	"Peter Walken"
];

export class Player {
	readonly id = generateToken();
	readonly name = characters[Math.floor(Math.random() * characters.length)];

	constructor (
		public socket: WebSocket
	) {}

	toJSON() {
		return {
			id: this.id,
			name: this.name
		}
	}
}