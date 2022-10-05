import WsServer = require('ws');
import http = require('http');
import { LobbyModel } from '../models/lobby.model';
import { parse } from 'url';
import { UserModel } from '../models/user.model';

export class LobbyService {
    lobbies: LobbyModel[] = [];

    constructor(private server: http.Server) {}

    create(isPrivate: boolean): LobbyModel {
        const token = this.getUniqueToken(this.lobbies.map(l => l.token));
        const wss = new WsServer.Server({ noServer: true });

        // Add websocket-server to http server
        this.server.on('upgrade', (request, socket, head) => {
            if (parse(request.url).pathname.slice(1) == token) {
                wss.handleUpgrade(request, socket, head, function done(ws) {
                    wss.emit('connection', ws, request);
                });
            }
        });

        // Add websocket events
        wss.on('connection', ws => {
            console.log('Client connected to', lobby.token);
            const id = this.getUniqueToken(lobby.users.map(u => u.id));

            ws.on('message', (message) => {
                const data = JSON.parse(message.toString());

                if (data.eventType == 'join') {
                    this.join(lobby, {
                        id, username: data.username, avatar: data.avatar
                    });

                    console.log(data.username, 'joined!')
                }

                for (const client of lobby.wss.clients) {
                    client.send(message.toString())
                }
            });

            ws.on('close', () => {
                console.log('Client disconnected from', lobby.token);
                this.leave(lobby.token, id);
            });
        });

        const lobby: LobbyModel = {
            wss, token, isPrivate, users: []
        };

        this.lobbies.push(lobby);

        return lobby;
    }

    findLobby(token: string): LobbyModel {
        const lobby = this.lobbies.find(lobby => lobby.token == token);

        if (!lobby) {
            throw new Error('Lobby not found');
        }
        
        return lobby
    }

    private join(lobby: LobbyModel, user: UserModel) {
        lobby.users.push(user);
    }

    private leave(token: string, id: string) {
        const lobby = this.findLobby(token);

        lobby.users.remove(lobby.users.find(u => u.id == id));

        if (!lobby.wss.clients.size) {
            console.log('Closing lobby', token);
            
            lobby.wss.close();
            this.lobbies.remove(lobby);

            console.log('Lobbies left', this.lobbies.length, this.lobbies.map(l => l.token));
        }
    }

    private getUniqueToken(existingTokens: string[]): string {
        let token: string;

        do {
            const tokenParts = [];

            for (let i = 0; i < 4; i++) {
                tokenParts.push(
                    Math.random().toString(32).slice(2, 6).split('').map(c => Math.random() >= 0.8 ? c.toUpperCase() : c).join('')
                );
            }

            token = tokenParts.join('-');
        } while (existingTokens.includes(token))

        return token;
    }
}
