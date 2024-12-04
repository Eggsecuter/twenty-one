import { Component } from "@acryps/page";
import { ChatComponent } from ".";
import { ChatMessage } from "../../../shared/chat-message";
import { ServerChatMessage } from "../../../shared/messages/server";

export class ChatMessagesComponent extends Component {
	declare rootNode: HTMLElement;
	declare parent: ChatComponent;

	constructor (
		private chatMessages: ChatMessage[]
	) {
		super();
	}

	onload() {
		this.parent.parent.parent.socket.subscribe(ServerChatMessage, message => {
			this.chatMessages.push(message.chatMessage);

			const scrolledToBottom = this.rootNode.scrollHeight - this.rootNode.scrollTop <= this.rootNode.clientHeight;
			const scrollY = this.rootNode.scrollTop;

			this.update();

			requestAnimationFrame(() => {
				// if scrolled to bottom automatically scroll down with new messages
				this.rootNode.scrollTo({
					top: scrolledToBottom ? this.rootNode.scrollHeight : scrollY,
					behavior: 'instant'
				});
			});
		});
	}

	render() {
		return <ui-chat-messages>
			{this.chatMessages.map(chatMessage => <ui-chat-message ui-system={!chatMessage.player}>
				{chatMessage.player && <ui-player-name>
					{chatMessage.player.id == this.parent.parent.parent.player.id ? 'You' : chatMessage.player.name}:
				</ui-player-name>}

				<ui-message>{chatMessage.message}</ui-message>
				<ui-time>{`0${chatMessage.timestamp.getHours()}`.slice(-2)}:{`0${chatMessage.timestamp.getMinutes()}`.slice(-2)}</ui-time>
			</ui-chat-message>)}
		</ui-chat-messages>;
	}
}
