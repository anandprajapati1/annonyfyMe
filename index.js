const express = require('express');
const { MyBot } = require("./src/bot");
const bodyParser = require('body-parser');

const myBot = new MyBot();
const app = express();
app.use(bodyParser.json());

app.post('/api/messages', async (req, res) => {
  const result = await myBot.onChat(req.body.message);
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