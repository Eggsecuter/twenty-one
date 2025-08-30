export class SocketMessageHandlerQueue {
	private handlers: (() => Promise<void>)[] = [];
	private running = false;

	push(handler: () => Promise<void>) {
		this.handlers.push(handler);

		// start runs if not already running
		if (!this.running) {
			this.running = true;

			this.run();
		}
	}

	// run handlers until none are left
	private async run() {
		if (!this.handlers.length) {
			this.running = false;
			return;
		}

		await this.handlers[0]();
		this.handlers.shift();

		this.run();
	}
}
