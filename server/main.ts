import path = require("path");
import express = require("express");

const app = express();
app.use(express.json());

app.get('/test', (_, res) => res.send('Hello Worldd'));

app.use('/', express.static(
    path.join(process.cwd(), '..', 'client', 'dist')
));

app.use('**', express.static(
    path.join(process.cwd(), '..', 'client', 'dist', 'index.html')
));

app.listen(process.env.PORT || 3000, () => console.log('server started'));
