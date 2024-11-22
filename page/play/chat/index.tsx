import { Component } from "@acryps/page";
import { PlayComponent } from "..";
import { ChatMessage } from "../../../shared/chat-message";
import { ClientChatMessage } from "../../../shared/messages/client";
import { ChatMessagesComponent } from "./messages";

export class ChatComponent extends Component {
	declare parent: PlayComponent;

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
						this.parent.player.socket.send(new ClientChatMessage(input.value));
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
