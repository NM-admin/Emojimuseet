'use strict';

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
  let text = payload.message.text;

  bot.getProfile(payload.sender.id, (err, profile) => {
    if (err) throw err;

    reply({ text }, (err) => {
      if (err) throw err;

      console.log(`Echoed back to ${profile.first_name} ${profile.last_name}: ${text}`);
    });
  });
});

http.createServer(bot.middleware()).listen(3000);
console.log('Echo bot server running at port 3000.');

const Facebook = {
	bot: () => {
    	return bot;
  	}
};

module.exports = Facebook;
