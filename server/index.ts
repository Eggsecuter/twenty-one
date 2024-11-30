import * as express from 'express';
import * as webSockets from 'express-ws';
import { join } from 'path';

import { GameManager } from './game/manager';

const app = express();
app.use(express.json());
webSockets(app);

new GameManager(app);

app.use('/built', express.static(join(process.cwd(), '..', 'page', 'built')));
app.use('/assets', express.static(join(process.cwd(), '..', 'page', 'assets')));
app.use('/', express.static(join(process.cwd(), '..', 'page', 'built')));
app.use('*', express.static(join(process.cwd(), '..', 'page', 'built', 'index.html')));

const port = +process.env.PORT! || 3000;

app.listen(port);
console.log(`app started on ${port}`);
