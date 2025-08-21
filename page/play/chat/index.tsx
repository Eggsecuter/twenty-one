import { Component } from "@acryps/page";
import { ChatMessage } from "../../../shared/chat-message";
import { ClientChatMessage } from "../../../shared/messages/client";
import { ChatMessagesComponent } from "./messages";
import { StateComponent } from "../states";

export class ChatComponent extends Component {
	declare parent: StateComponent;

	private chatMessagesComponent: ChatMessagesComponent;

	constructor(chatMessages: ChatMessage[]) {
		super();

		this.chatMessagesComponent = new ChatMessagesComponent(chatMessages);
	}

	addChatMessage(message: ChatMessage) {
		this.chatMessagesComponent.addMessage(message);
	}

	render() {
		let input: HTMLInputElement;

		requestAnimationFrame(() => {
			input.onkeyup = event => {
				if (event.key == 'Enter') {
					if (input.value.trim()) {
						this.parent.parent.socket.send(new ClientChatMessage(input.value));
						input.value = '';
					}
				}
			}
		});

		return <ui-chat>
			{this.chatMessagesComponent}

			{input = <input placeholder='Enter message' />}
		</ui-chat>;
	}
}
