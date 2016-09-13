'use strict';

const sendToEveryone = require('./send-to-everyone');
const findUpcoming = require('./find-upcoming');
const compareSermonsByDate = require('./compare-dates');
const buildMessage = require('./build-message');

/**
 * @param Array upcoming array of upcoming sermons
 * @param Array recipients array of recipients
 * @param Object config config object, loaded from config.yml at runtime
 * @param Moment atDate the date to send emails, typically now() at runtime
 * @param Object emailer an object with a send function that returns a Request, with a promise function
 * @param Function esvFetch a function that returns a promise which resolves to the sermon passage
 */
function* sendLogic(upcoming, recipients, config, atDate, emailer, esvFetch) {
  const nextSermon = findUpcoming(
    atDate,
    upcoming.sort(compareSermonsByDate),
    config.timeZone);
  console.log(`Next sermon is ${JSON.stringify(nextSermon)}`)

  const passageText = yield esvFetch(nextSermon.passage);
  console.log(`Fetched text for passage ${nextSermon.passage}`);
  console.log(passageText);

  const content = buildMessage(nextSermon, passageText);
  const paramTemplate = {
    from: `${config.fromName} <${config.fromEmail}>`,
    subject: content.subject,
    bodyHtml: content.bodyHtml
  };

  const resolutions = yield sendToEveryone(emailer, paramTemplate, recipients);
  console.log(JSON.stringify(resolutions));
}

module.exports = sendLogic;
