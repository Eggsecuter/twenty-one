export class Player {
	id: string;
	name: string;

	get color() {
		const maxTokenValue = 2176782336; // token is base 36 and 6 characters long

		return `hsl(${360 / maxTokenValue * parseInt(this.id, 36)}, 100%, 70%)`;
	}

	static from(serialized) {
		const player = new Player();
		player.id = serialized.id;
		player.name = serialized.name;

		return player;
	}
}
