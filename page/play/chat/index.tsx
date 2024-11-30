import { Component } from "@acryps/page";
import { ChatMessage } from "../../../shared/chat-message";
import { ClientChatMessage } from "../../../shared/messages/client";
import { ChatMessagesComponent } from "./messages";
import { StateComponent } from "../states";

export class ChatComponent extends Component {
	declare parent: StateComponent;

	constructor (
		private chatMessages: ChatMessage[]
	) {
		super();
	}

	render() {
		let input: HTMLInputElement;

		requestAnimationFrame(() => {
			input.onkeyup = event => {
				if (event.key == 'Enter') {
					if (input.value.trim()) {
						this.parent.parent.player.socket.send(new ClientChatMessage(input.value));
						input.value = '';
					}
				}
			}
		});

		return <ui-chat>
			{new ChatMessagesComponent(this.chatMessages)}

			{input = <input placeholder='Enter message' />}
		</ui-chat>;
	}
}
