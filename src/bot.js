// const { ActivityTypes } = require('botbuilder');
const { NlpManager } = require('node-nlp/lib');
const { initTrainingNlp, trainNlp } = require('./train-nlp');

class MyBot {
  constructor() {
    this.lang = "en";
    this.nlpManager = new NlpManager({ languages: [this.lang] });
    this.threshold = 0.75;
    initTrainingNlp(this.nlpManager, console.log);
  }

  async onChat(line) {
    let _response = "";
    try {
      const result = await this.nlpManager.process(line);
      const answer = result.score > this.threshold && result.answer ? result.answer : "Sorry, I don't understand";
      let sentiment = '';
      if (result.sentiment.score !== 0) {
        sentiment = `  ${result.sentiment.score > 0 ? ':)' : ':('}   Confidence(${result.score}), Sentiment(${result.sentiment.score})`;
      }
      _response = `BOT> ${answer}${sentiment}`;
    } catch (error) {
      console.log(error);
    } finally {
      return _response;
    }
  }

  async onChat2(line) {
    let _response = "";
    try {
      let result = await this.nlpManager.nerManager.findEntities(line, this.lang);
      result = result.filter((x) => x.accuracy > this.threshold).sort((a, b) => b.accuracy - a.accuracy);
      let answer;
      result.forEach(x => {
        answer = !answer ? this.nlpManager.getAnswer(this.lang, x.entity) : "Sorry, I don't understand";
      });
      if(!answer){
        answer = "Sorry, I don't understand";
      }
      _response = `BOT> ${answer}`;
    } catch (error) {
      console.log(error);
    } finally {
      return _response;
    }
  }

  async onTrain(_data) {
    try {
      return trainNlp(this.nlpManager, new QueryModel(_data.text, _data.category, _data.answer));
    } catch (error) {
      console.log(error);
    }
  }
}

class QueryModel {
  constructor(_text = "", _cat = "bot.default", _ans = "") {
    this.text = _text;
    this.category = _cat;
    this.answer = _ans;
  }
}

module.exports.MyBot = MyBot;
module.exports.QueryModel = QueryModel;