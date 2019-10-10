// const { ActivityTypes } = require('botbuilder');
const { NlpManager, ConversationContext } = require('node-nlp/lib');
const { initTrainingNlp, trainNlp } = require('./train-nlp');
const fs = require('fs');
const UUID = require('uuid/v1');

class MyBot {
  constructor() {
    this.lang = "en";
    this.nlpManager = new NlpManager({ languages: [this.lang] });
    this.context = new ConversationContext();
    this.threshold = 0.75;
    this.userId = 111;
    initTrainingNlp(this.nlpManager, console.log);
    if (fs.existsSync('./conversation.json')) {
      this.conversation = JSON.parse(fs.readFileSync('./conversation.json'));
      // console.log(this.conversation);
    } else {
      console.log("not found");
    }
  }

  async onChat_old(line) {
    let _response = "";
    try {
      const result = await this.nlpManager.process(line);
      const answer = result.score > this.threshold && result.answer ? result.answer : "Sorry, I don't understand";
      let sentiment = '';
      if (result.sentiment.score !== 0) {
        sentiment = `${result.sentiment.score > 0 ? ':)' : ':('}   Confidence(${result.score}), Sentiment(${result.sentiment.score})`;
      }
      _response = `BOT> ${answer} ${sentiment}`;
    } catch (error) {
      console.log(error);
    } finally {
      return _response;
    }
  }

  async onChat(line) {
    let _response = line;
    let _pii = [];
    let result;
    try {
      result = await this.nlpManager.nerManager.findEntities(line, this.lang);
      result = result.filter((x) => x.accuracy > this.threshold).sort((a, b) => b.accuracy - a.accuracy);
      let answer = "";
      result.forEach(x => {
        let _ans = this.nlpManager.getAnswer(this.lang, x.entity);
        if (_ans) {
          answer += _ans + "\n";
          _response = _response.replace(x.sourceText, `<${x.entity}>`);
          _pii.push({ "key": x.entity, value: x.sourceText, confidence: x.accuracy });
        }
      });

      console.log(answer);
      _response = `BOT> Saved data is: ${_response}`;
    } catch (error) {
      console.log(error);
    } finally {
      this.saveData(new Conversation(_response, this.userId, "USER", result.map(x => { return { kay: x.entity, value: x.sourceText }; })));
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

  getChatData() {
    return this.conversation.filter(x => x.initiator === this.userId);
  }

  saveData(d) {
    this.conversation.push(d);
    fs.writeFileSync('./conversation.json', JSON.stringify(this.conversation));
  }
}

class QueryModel {
  constructor(_text = "", _cat = "bot.default", _ans = "") {
    this.text = _text;
    this.category = _cat;
    this.answer = _ans;
  }
}

class Conversation {
  constructor(_text = "", _initiator = 0, _type = "USER", _pii = [{ key: "", value: "", confidence: 0 }]) {
    this.conId = UUID();
    this.text = _text;
    this.initiator = _initiator;
    this.type = _type;
    this.PII = _pii;
    this.PII.forEach(x => {
      x.conversationId = this.conId;
    });
  }
}

module.exports.MyBot = MyBot;
module.exports.QueryModel = QueryModel;