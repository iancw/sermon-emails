'use strict';
const moment = require('moment-timezone');
const buildMessage = require('./build-message');
const sendAWS = require('./send-aws');
const sendToEveryone = require('./send-to-everyone');
const findUpcoming = require('./find-upcoming');
const compareSermonsByDate = require('./compare-dates');
const upcoming = require('./upcoming');
const esv = require('./esv');
const config = require('./config');
const privateRecipients = require('./_recipients_private.json');

function fetchText(passage) {
  return esv.fetchPassage(passage, config.esvKey);
}

function recipients() {
  return privateRecipients;
}

function* sendEmails() {
  const nextSermon = findUpcoming(
    moment.tz(config.timeZone),
    upcoming.sort(compareSermonsByDate),
    config.timeZone);
  console.log(`Next sermon is ${JSON.stringify(nextSermon)}`)
  const passageText = yield fetchText(nextSermon.passage);
  console.log(`Fetched text for passage ${nextSermon.passage}`);
  console.log(passageText);
  const content = buildMessage(nextSermon, passageText);
  const paramTemplate = {
    from: `${config.fromName} <${config.fromEmail}>`,
    subject: content.subject,
    bodyHtml: content.bodyHtml
  };

  const ses = sendAWS.create();
  const requests = sendToEveryone(ses, paramTemplate, recipients());
  console.log(`waiting for ${requests.length} promises`);
  yield requests.map( req => req.promise());
  console.log('all promises have resolved');
}

module.exports = sendEmails;