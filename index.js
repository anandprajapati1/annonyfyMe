const express = require('express');
const MyBot = require("./src/bot");
const bodyParser = require('body-parser');

const myBot = new MyBot();
const app = express();
app.use(bodyParser.json());

// app.post('/api/messages', (req, res) => {
  // adapter.processActivity(req, res, async context => {
  //   await myBot.onTurn(context);
  // });
// });

app.post('/api/messages', async (req, res) => {
  const result = await myBot.onChat(req.body.message);
  console.log(result);
  res.send(result);
});

app.get('/api/isActive', (req, res)=>{
  res.send('Working!');
});

app.listen(process.env.port || process.env.PORT || 3000);
console.log('Bot listening');