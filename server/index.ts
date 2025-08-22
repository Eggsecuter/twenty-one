import * as express from 'express';
import * as webSockets from 'express-ws';
import cookieParser = require('cookie-parser');
import { join } from 'path';
import { randomUUID } from 'crypto';
import { LobbyManager } from './lobby/manager';

const deviceIdCookieName = '__udi';
export const getDeviceId = (request) => request.cookies[deviceIdCookieName] as string;

const app = express();

app.use(express.json());
app.use(cookieParser());
webSockets(app);

// set unique device identifier
app.use((request, response, next) => {
	let deviceId = getDeviceId(request);

	if (!deviceId) {
		deviceId = randomUUID();

		response.cookie(deviceIdCookieName, deviceId, {
			maxAge: 30 * 24 * 60 * 60 * 1000
		});
	}

	next();
});

new LobbyManager(app);

app.use('/assets/icons', express.static(join(process.cwd(), '..', 'page', 'built', 'icons', 'font')));
app.use('/assets', express.static(join(process.cwd(), '..', 'page', 'assets')));
app.use('/built', express.static(join(process.cwd(), '..', 'page', 'built')));

app.use('*', (_, response) => response.sendFile(join(process.cwd(), '..', 'page', 'assets', 'index.html')));

const port = +process.env.PORT! || 3000;

app.listen(port);
console.log(`app started on ${port}`);
