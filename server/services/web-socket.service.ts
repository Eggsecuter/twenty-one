import WsServer = require('ws');
import http = require('http');
import { SocketEventModel, SocketEventType } from "../models/socket-event.model";
import { UserModel } from "../models/user.model";
import { parse } from 'url';

export default class WebSocketService {
    // private socket: WsServer.Server;

    // constructor (server: http.Server, token: string) {
    //     this.socket = new WsServer.Server({ noServer: true });

    //     // Add websocket server to http server
    //     server.on('upgrade', (request, socket, head) => {
    //         if (parse(request.url).pathname.slice(1) == token) {
    //             wss.handleUpgrade(request, socket, head, function done(ws) {
    //                 wss.emit('connection', ws, request);
    //             });
    //         }
    //     });
    // }

    // on<T>(eventType: SocketEventType, handler: (data: T) => void) {
    //     this.socket.addEventListener('message', event => {
    //         const message = JSON.parse(event.data) as SocketEventModel;

    //         if (message.type == eventType) {
    //             handler(message.data as T);
    //         }
    //     });
    // }

    // emit(eventType: SocketEventType, data: any) {
    //     const socketEvent: SocketEventModel = {
    //         type: eventType, data
    //     }

    //     this.socket.send(
    //         JSON.stringify(socketEvent)
    //     );
    // }

    // close() {
    //     this.socket.close();
    // }

    static broadcast() {
        
    }
}
