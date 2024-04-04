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
	readonly id: string;
	readonly name: string;

	constructor (
		public socket: WebSocket
	) {
		this.id = generateToken();
		this.name = characters[Math.floor(Math.random() * characters.length)];
	}

	toJSON() {
		return {
			id: this.id,
			name: this.name
		}
	}
}