'use strict';
const moment = require('moment-timezone');
const jsYaml = require('js-yaml');
const config = require('./config');
const sesEmailer = require('./ses');
const esv = require('./esv');
const sendLogic = require('./send-logic');
const fetchS3 = require('./fetch-s3');

function* fetchData(key) {
  const body = yield fetchS3({
    bucket: config.dataBucket,
    key: key,
  });
  return jsYaml.safeLoad(body);
}

function* sendEmails() {
  const atDate = moment.tz(config.timeZone);
  const emailer = sesEmailer.create();
  const upcoming = yield fetchData('upcoming.yml');
  const privateRecipients = yield fetchData('_recipients_private.yml');

  yield sendLogic(
    upcoming,
    privateRecipients,
    config,
    atDate,
    emailer,
    esv.fetchPassage.bind(esv.fetchPassage, config.esvKey));
}

module.exports = sendEmails;
