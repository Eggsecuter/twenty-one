import WsServer = require('ws');
import http = require('http');
import { LobbyModel } from './lobby.model';
import { parse } from 'url';

export class LobbyService {
    lobbies: LobbyModel[] = [];

    constructor(private server: http.Server) {}

    create(isPrivate: boolean): LobbyModel {
        let token;

        // Prevent duplicate tokens
        while (!token && !this.lobbies.some(l => l.token == token)) {
            token = this.generateToken();
        }

        const wss = new WsServer.Server({ noServer: true, path: `/${token}` });

        // Add websocket-server to http server
        this.server.on('upgrade', (request, socket, head) => {
            if (parse(request.url).pathname.slice(1) == token) {
                wss.handleUpgrade(request, socket, head, function done(ws) {
                    wss.emit('connection', ws, request);
                });
            }
        });

        const lobby: LobbyModel = {
            wss, token, isPrivate
        };

        this.lobbies.push(lobby);

        return lobby;
    }

    join(token: string): LobbyModel {
        return this.findLobby(token);
    }

    leave(token: string) {
        const lobby = this.findLobby(token);

        if (!lobby.wss.clients.size) {
            console.log('Closing lobby', token);
            
            lobby.wss.close();
            this.lobbies.splice(this.lobbies.indexOf(lobby), 1);

            console.log('Lobbies left', this.lobbies.length, this.lobbies.map(l => l.token));
        }
    }

    private findLobby(token: string): LobbyModel {
        const lobby = this.lobbies.find(lobby => lobby.token == token);

        if (!lobby) {
            throw new Error('Lobby not found');
        }
        
        return lobby
    }

    private generateToken(): string {
        const tokenParts = [];

        for (let i = 0; i < 4; i++) {
            tokenParts.push(
                Math.random().toString(32).slice(2, 6).split('').map(c => Math.random() >= 0.8 ? c.toUpperCase() : c).join('')
            );
        }

        return tokenParts.join('-');
    }
}
