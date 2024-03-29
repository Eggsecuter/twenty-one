import { gameManager } from "./game.manager";
import { join } from "path";

const express = require('express');
const webSockets = require('express-ws');

const app = express();
app.use(express.json());
webSockets(app);

gameManager(app);

app.use(express.static(join(process.cwd(), '..', 'page', 'built')));

app.get('*', (_, res) => res.sendFile(join(process.cwd(), '..', 'page', 'built', 'index.html')));

app.listen(+process.env.PORT! || 3000);