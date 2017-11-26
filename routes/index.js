const express = require('express');
const clientList = require('../clientList');
let router = express.Router();
let messages = ['Hey there, welcome to BChat! Server started at ' + new Date().toISOString(), 'Introduce yourself...'];

// sends latest message to all connected clients
const notify = () => {
  clientList.forEach((client) => {
    client.send(messages[messages.length - 1]);
  });
};

// serves homepage
router.get('/', (req, res) => {
  res.render('home', {messages: messages});
});

// creates server send event (sse) stream for a client
router.get('/events', (req, res) => {
  var sseConnection = res.sseConnection;
  sseConnection.setup();
  clientList.add(sseConnection);
});

// handles incoming messages
router.post('/chat', (req, res) => {
  console.log(req.body.content);

  // appends new message to list of messages
  messages.push(req.body.content);

  // tells client message has been handled
  res.end();

  notify();
});

module.exports = router;
