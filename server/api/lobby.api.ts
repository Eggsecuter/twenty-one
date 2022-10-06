import { Express } from 'express-serve-static-core';
import http = require('http');
import { UserModel } from '../models/user.model';
import { LobbyService } from '../services/lobby.service';

export const LobbyAPI = (basePath: string, app: Express, server: http.Server) => {
    const service = new LobbyService(server);

    app.get(`${basePath}/:token`, (req, res) => {
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
