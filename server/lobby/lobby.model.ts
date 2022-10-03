import { Server } from 'ws';

export interface LobbyModel {
    wss: Server;
    token: string;
    isPrivate: boolean;
}
