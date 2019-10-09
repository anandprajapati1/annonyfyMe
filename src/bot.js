// const { ActivityTypes } = require('botbuilder');
const { NlpManager } = require('node-nlp/lib');
const trainnlp = require('./train-nlp');

class MyBot {
  constructor() {
    this.nlpManager = new NlpManager({ languages: ['en'] });
    this.threshold = 0.75;
    trainnlp(this.nlpManager, console.log);
  }

  async onChat(line){
    let _response = "";
    try {
      const result = await this.nlpManager.process(line); 
      const answer = result.score > this.threshold && result.answer ? result.answer : "Sorry, I don't understand";
      let sentiment = '';
      if (result.sentiment.score !== 0) {
        sentiment = `  ${result.sentiment.score > 0 ? ':)' : ':('}   Confidence(${result.score}), Sentiment(${result.sentiment.score})`;
      }
      _response = `bot> ${answer}${sentiment}`;
    } catch (error) {
      console.log(error);
    } finally {
      return _response;
    }
  }
}

module.exports = MyBot;