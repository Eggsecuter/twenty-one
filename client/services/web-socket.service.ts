import { SocketEventModel, SocketEventType } from "../models/socket-event.model";
import { UserModel } from "../models/user.model";
import { websocketBasePath } from "../util/constants";

export default class WebSocketService {
    private socket: WebSocket;

    constructor (lobbyToken: string, user: UserModel) {
        this.socket = new WebSocket(`${websocketBasePath}/${lobbyToken}`);

        this.socket.addEventListener('open', () => {
            this.emit(SocketEventType.Join, user);
        });
    }

    on<T>(eventType: SocketEventType, handler: (data: T) => void) {
        this.socket.addEventListener('message', event => {
            const message = JSON.parse(event.data) as SocketEventModel;

            if (message.type == eventType) {
                handler(message.data as T);
            }
        });
    }

    emit(eventType: SocketEventType, data: any) {
        const socketEvent: SocketEventModel = {
            type: eventType, data
        }

        this.socket.send(
            JSON.stringify(socketEvent)
        );
    }

    close() {
        this.socket.close();
    }
}
