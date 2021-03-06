const express = require('express');
const app = express();
const path = require('path');
const routes = require('./routes');
const sse = require('./sse');
const bodyParser = require('body-parser');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

// Server Send Events - allows server to push events to client asynchronously
app.use(sse.sseMiddleware)


app.use('/', routes);

app.listen(3001, () => console.log('Example app listening on port 3000!'));
