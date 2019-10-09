/*
 * Copyright (c) AXA Group Operations Spain S.A.
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const fs = require("fs");

module.exports.initTrainingNlp = async function initTrainingNlp(manager, say) {
  if (fs.existsSync('./model.nlp')) {
    manager.load('./model.nlp');
    return;
  }

  manager.addDocument('en', 'say about you', 'agent.acquaintance');
  manager.addDocument('en', 'your age', 'agent.age');
  manager.addDocument('en', 'you are annoying me so much', 'agent.annoying');
  manager.addDocument('en', 'are you working today', 'agent.busy');
  manager.addRegexEntity('_creditcard', 'en', /[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}|[0-9]{16}/gi);
  say('Training, please wait..');
  const hrstart = process.hrtime();
  await manager.train();
  const hrend = process.hrtime(hrstart);
  console.info('Trained (hr): %ds %dms', hrend[0], hrend[1] / 1000000);
  say('Trained!');

  manager.addAnswer('en', 'agent.acquaintance', "I'm a virtual agent");
  manager.addAnswer('en', 'agent.age', "I'm very young");
  manager.addAnswer('en', 'agent.annoying', "I'll try not to annoy you");
  manager.addAnswer('en', 'agent.busy', "Please wait");
  manager.addAnswer('en', '_creditcard', "Found sensitive detail(credit card)");
  manager.addAnswer('en', 'phonenumber', "Found sensitive detail(phone)");
  manager.addAnswer('en', 'email', "Found sensitive detail(email)");
  manager.addAnswer('en', 'datetime', "Found sensitive detail(date)");
  
  manager.save('./model.nlp');
};

module.exports.trainNlp = async function trainNlp(manager, td, lang="en") {  
  if (fs.existsSync('./model.nlp')) {
    manager.load('./model.nlp');
  
    manager.addDocument(lang, td.text, td.category);
    console.log('Training, please wait..');
    const hrstart = process.hrtime();
    await manager.train();
    const hrend = process.hrtime(hrstart);
    console.info('Trained (hr): %ds %dms', hrend[0], hrend[1] / 1000000);
    
    manager.addAnswer(lang, td.category ,td.answer);
    manager.save('./model.nlp');
    return "Trained!";
  } else {
    return "No mathing data";
  }
};