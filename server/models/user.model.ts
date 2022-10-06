import WsServer = require('ws');

export interface UserModel {
    socket: WsServer.WebSocket;
    username: string;
    avatar: string;
}
