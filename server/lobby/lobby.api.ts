import { Express } from 'express-serve-static-core';
import http = require('http');
import { LobbyService } from './lobby.service';

export const LobbyAPI = (basePath: string, app: Express, server: http.Server) => {
    const service = new LobbyService(server);

    app.get(`${basePath}/:token`, (req, res) => {
        const token = req.params.token;

        try {
            service.join(token);

            res.end();
        } catch (err) {
            res.status(404).send(err.message);
        }
    });

    app.post(`${basePath}`, (req, res) => {
        const lobby = service.create(req.body.isPrivate ?? false);

        lobby.wss.on('connection', (ws) => {
            console.log('Client connected to ', lobby.token);

            ws.on('message', (data) => {
                for (const client of lobby.wss.clients) {
                    client.send(data.toString())
                }
            });

            ws.on('close', function(connection) {
                console.log('Client disconnected from ', lobby.token);
            });
        });

        res.send(lobby.token);
    });
}
