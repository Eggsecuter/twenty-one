import { app } from "../main";
import { SocketEventModel, SocketEventType } from "../models/socket-event.model";
import { UserModel } from "../models/user.model";
import { websocketBasePath } from "../util/constants";

export default class WebSocketService {
    private socket: WebSocket;

    constructor (lobbyToken: string, onConnectionLost: () => void) {
        this.socket = new WebSocket(`${websocketBasePath}/${lobbyToken}`);

        this.socket.onopen = () => {
            this.emit(SocketEventType.Join, app.currentUser);
        };

        this.socket.onclose = () => {
            this.close();
            onConnectionLost();
        }
    }

    on<T>(eventType: SocketEventType, handler: (sender: UserModel, data: T) => void) {
        this.socket.addEventListener('message', event => {
            const message = JSON.parse(event.data) as SocketEventModel;

            if (message.type == eventType) {
                handler(message.sender, message.data as T);
            }
        });
    }

    emit(eventType: SocketEventType, data: any) {
        const socketEvent: SocketEventModel = {
            type: eventType, sender: app.currentUser, data
        }

        this.socket.send(
            JSON.stringify(socketEvent)
        );
    }

    close() {
        this.socket.close();
    }
}
