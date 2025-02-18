export class EventQueue {
	private eventHandlers: (() => Promise<void>)[] = [];
	private running = false;
	
	push(handler: () => Promise<void>) {
		this.eventHandlers.push(handler);
		
		// start runs if not already running
		if (!this.running) {
			this.running = true;
			
			this.run();
		}
	}
	
	// run handlers until none are left
	private async run() {
		if (!this.eventHandlers.length) {
			this.running = false;
			return;
		}

		await this.eventHandlers[0]();
		this.eventHandlers.shift();
		
		this.run();
	}
}
