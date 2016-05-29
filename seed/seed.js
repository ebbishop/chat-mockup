// run once to generate random user names, photos and conversation text

var fs = require('fs');
var _ = require('lodash');
var chance = require('chance')(12345);
var moment = require('moment');

var CONVO_FILE = './seed/convos.json';

var contacts;
var texts;

function randPhoto(g){
    var n = _.random(0,96)
    return 'http://api.randomuser.me/portraits/thumb/' + g + '/' + n + '.jpg';
};

function createContacts(){
  var contacts = [];
  var contact;
  var g1, g2;

  for (var i = 0; i < 40; i++){
    g1 = chance.pickone(['men', 'women']);

    if (g1 === 'men') g2 = 'male';
    else g2 = 'female';

    contact = {name: chance.name({gender: g2}), img: randPhoto(g1)};
    contacts.push(contact);
  }

  return contacts;
}

function createConversations(){
  var me = {name: 'Emma Bishop', img: 'assets/emma.jpg'};
  var contacts = createContacts();
  var convo;
  var convos = [];
  var text;

  for (var i = 0; i < 40; i++){
    // initizlize texts with one random text
    contact = contacts[i];
    texts = [createText(chance.pickone([me, contact]))];
    ctTxt = chance.integer({min: 5, max: 100}); // random number of additional texts

    for (var j = 0; j < ctTxt; j++){
      text = createText(chance.pickone([me, contacts[i]]), texts[texts.length-1].time);
      texts.push(text);
    }

    convo = {
      contact: contacts[i],
      texts: texts
    };

    convos.push(convo);

  }

  return convos;

}

function createText(from, minDate) {
  var text = {};
  if (!minDate){
    minDate = chance.date({year: 2015});
  }

  text.from = from;
  text.sentTime = moment(minDate).add(chance.integer({min:6000, max: 172800000}), 'milliseconds');
  text.content = chance.paragraph({sentences: chance.integer({min:1, max: 4})});

  return text;
}

function writeData() {
  var convos = createConversations();
  fs.writeFileSync(CONVO_FILE, 'var convos = ' + JSON.stringify(convos), {encoding: 'utf8'});
}

writeData();