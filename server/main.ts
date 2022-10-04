import express = require("express");
import path = require("path");
import http = require('http');
import { LobbyAPI } from "./lobby/lobby.api";

const app = express();
const server = http.createServer(app);
const PORT = +(process.env.PORT ?? 3000);

app.use(express.json());

LobbyAPI('/api/lobby', app, server);

app.use('/', express.static(
    path.join(process.cwd(), '..', 'client', 'dist')
));
    
app.use('**', express.static(
    path.join(process.cwd(), '..', 'client', 'dist', 'index.html')
));

server.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`)
});
