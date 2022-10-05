import { Express } from 'express-serve-static-core';
import http = require('http');
import { LobbyService } from './lobby.service';

export const LobbyAPI = (basePath: string, app: Express, server: http.Server) => {
    const service = new LobbyService(server);

    app.post(`${basePath}/:token`, (req, res) => {
        const token = req.params.token;

        try {
            service.findLobby(token);

            res.end();
        } catch (err) {
            res.status(404).send(err.message);
        }
    });

    app.post(`${basePath}`, (req, res) => {
        const lobby = service.create(req.body.isPrivate ?? false);

        res.send(lobby.token);
    });
}
