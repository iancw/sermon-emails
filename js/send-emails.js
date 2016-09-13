'use strict';
const moment = require('moment-timezone');
const upcoming = require('./upcoming');
const config = require('./config');
const privateRecipients = require('./_recipients_private.json');
const sesEmailer = require('./ses');
const esv = require('./esv');
const sendLogic = require('./send-logic');

function recipients() {
  return privateRecipients;
}

function* sendEmails() {
  const atDate = moment.tz(config.timeZone);
  const emailer = sesEmailer.create();
  yield sendLogic(
    upcoming,
    recipients,
    config,
    emailer,
    esv.fetchPassage.bind(esv.fetchPassage, config.esvKey));
}

module.exports = sendEmails;
