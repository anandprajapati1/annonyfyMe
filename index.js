const express = require('express');
const { MyBot } = require("./src/bot");
const bodyParser = require('body-parser');
var cors = require('cors');

const myBot = new MyBot();
const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post('/api/messages', async (req, res) => {
  const result = await myBot.onChat(req.body.message);
  // save in DB
  res.send(result);
});

app.get('/api/getConversation', (req, res) => {
  const result = myBot.getChatData();
  // save in DB
  res.send(result);
});

app.post('/api/train', async (req, res) => {
  const result = await myBot.onTrain(req.body);
  res.send(result);
});

app.get('/api/isActive', (req, res) => {
  res.send('Working!');
});

app.listen(process.env.port || process.env.PORT || 3000);
console.log('Bot listening');