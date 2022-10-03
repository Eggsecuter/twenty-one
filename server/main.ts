import path = require("path");
import express = require("express");
import { WebSocketServer } from "ws";

const app = express();
app.use(express.json());

app.get('/api', (_, res) => res.send('Hello World'));

app.use('/', express.static(
    path.join(process.cwd(), '..', 'client', 'dist')
));

app.use('**', express.static(
    path.join(process.cwd(), '..', 'client', 'dist', 'index.html')
));

const wss = new WebSocketServer({ port: +process.env.PORT || 3001 });

wss.on('connection', ws => {
    ws.on('message', data => {
        wss.clients.forEach(client => {
            client.send(data.toString());
        });
    });
});

app.listen(process.env.PORT || 3000, () => console.log('server started'));
