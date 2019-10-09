const express = require('express');
const { BotFrameworkAdapter } = require('botbuilder');
const MyBot = require("./src/bot");
// const basicAuth = require('basic-auth-connect');

const myBot = new MyBot();
const app = express();
// app.use(basicAuth(function(user, pass) {
//   return (user === 'testuser' && pass === 'test');
// }));

const adapter = new BotFrameworkAdapter({
  appId: process.env.BOT_APP_ID,
  appPassword: process.env.BOT_APP_PASSWORD,
});

adapter.onTurnError = async context => {
  await context.sendActivity('Oops. Something went wrong!');
};

app.post('/api/messages', (req, res) => {
  adapter.processActivity(req, res, async context => {
    await myBot.onTurn(context);
  });
});

app.get('/api/isActive', (req, res)=>{
  res.send('Working!');
});

app.listen(process.env.port || process.env.PORT || 3000);
console.log('Bot listening');