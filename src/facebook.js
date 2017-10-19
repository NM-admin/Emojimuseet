'use strict';

const http = require('http');
const Bot = require('messenger-bot');
let bot = new Bot({
  token: process.env.FACEBOOK_PAGE_TOKEN,
  verify: process.env.FACEBOOK_VERIFY_TOKEN,
  app_secret: process.env.FACEBOOK_APP_SECRET
});

const Facebook = {

};

module.exports = Facebook;
