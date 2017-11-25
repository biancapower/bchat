const express = require('express');
const clientList = require('../clientList');
let router = express.Router();
let messages = ['hi there', 'you\'re a message'];

const notify = () => {
  clientList.forEach((client) => {
    client.send(messages[messages.length - 1]);
  });
};

router.get('/', (req, res) => {
  res.render('home', {messages: messages});
});

router.get('/events', (req, res) => {
  var sseConnection = res.sseConnection;
  sseConnection.setup();
  clientList.add(sseConnection);
});

router.post('/', (req, res) => {
  console.log(req.body.content);
  messages.push(req.body.content);
  res.end();

  notify();
});

module.exports = router;
