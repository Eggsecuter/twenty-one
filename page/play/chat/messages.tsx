import { Component } from "@acryps/page";
import { ChatComponent } from ".";
import { ChatMessage } from "../../../shared/chat-message";
import { ServerChatMessage } from "../../../shared/messages/server";

export class ChatMessagesComponent extends Component {
	declare parent: ChatComponent;

	constructor (
		private chatMessages: ChatMessage[]
	) {
		super();
	}

	onload() {
		this.parent.parent.parent.player.socket.subscribe(ServerChatMessage, message => {
			this.chatMessages.push(message.chatMessage);
			this.update();
		});
	}

	render() {
		return <ui-chat-messages>
			{this.chatMessages.map(chatMessage => <ui-chat-message>
				<ui-time>[{chatMessage.timestamp.getHours()}:{chatMessage.timestamp.getMinutes()}]</ui-time>

				{chatMessage.player && <ui-player-name>
					{chatMessage.player.id == this.parent.parent.parent.player.id ? 'You' : chatMessage.player.name}:
				</ui-player-name>}

				<ui-message>{chatMessage.message}</ui-message>
			</ui-chat-message>)}
		</ui-chat-messages>
	}
}
