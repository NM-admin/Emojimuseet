'use strict';

const Images = require('../src/images');
const Twitter = require('../src/twitter');
const ReplyTweet = require('../src/tweets/reply_tweet');
const RequestTweet = require('../src/tweets/request_tweet');
//const Facebook = require('../src/facebook');

let stream = Twitter.stream();

stream.on('tweet', (payload) => {
  let request_tweet = new RequestTweet(payload);

  if (request_tweet.shouldReply()) {
    let image = new Images().getFromText(request_tweet.getText());
    if (!image) { return; }

    let reply_tweet = new ReplyTweet(request_tweet, image);
    Twitter.reply(reply_tweet);
  }
});

stream.on('error', (payload) => {
  console.error(payload);
});



const http = require('http');
const Bot = require('messenger-bot');
let bot = new Bot({
  token: process.env.FACEBOOK_PAGE_TOKEN,
  verify: process.env.FACEBOOK_VERIFY_TOKEN,
  app_secret: process.env.FACEBOOK_APP_SECRET
});

bot.on('error', (err) => {
  console.log(err.message);
});

bot.on('message', (payload, reply) => {
  //let text = payload.message.text; //change this to emoji
  console.log(payload.message);
  if (payload.message.text == undefined) {
    let text = 'Ditt meddelande innehöll ingen emoji. Skicka en emoji så får du ett foto eller föremål från ett svenskt museum till svar.';
    console.log('ingen text i meddelandet');
    bot.getProfile(payload.sender.id, (err, profile) => {
      if (err) throw err;

      reply({ text }, (err) => {
        if (err) throw err;

        console.log(`Echoed back to ${profile.first_name} ${profile.last_name}: ${text}`);
      });
    });
  }
  else {
    console.log(payload.message.text);
    let image = new Images().getFromText(payload.message.text);
    let text = '';
    if (!image) {
      text = 'Ditt meddelande innehöll ingen emoji. Skicka en emoji så får du ett foto eller föremål från ett svenskt museum till svar.';
    }

    if (image.url == undefined) {
      text = `${image.key} Tyvärr! 🤔😞😬 Kanske hittar du något på https://digitaltmuseum.se?`;
    }
    else {
      text = `${image.key} ${image.url}`;
    }
    console.log(text);

    bot.getProfile(payload.sender.id, (err, profile) => {
      if (err) throw err;

      reply({ text }, (err) => {
        if (err) throw err;

        console.log(`Echoed back to ${profile.first_name} ${profile.last_name}: ${text}`);
      });
    });
  }
});

http.createServer(bot.middleware()).listen(3000);
console.log('Echo bot server running at port 3000.');
