'use strict';

const tape = require('tape');
const sendLogic = require('./send-logic');
const moment = require('moment-timezone');
const co = require('co');

tape('test send-logic', function(t) {
  t.plan(2);
  const upcoming = [{
    date: 'January 3',
    passage: 'Luke 18:9-30',
    title: 'The One Who Humbles Himself Will Be Exalted'
  }];
  const config = {
    fromName: 'From Name',
    fromEmail: 'from.email@email.com',
    esvKey: 'IP',
    timeZone: 'America/New_York'
  };
  const atDate = moment.tz('January 3', 'MMMM D', config.timeZone);
  const emailer = {
    loggedParams: [],
    send: function(params) {
      this.loggedParams.push(params);
      return new Promise((resolve, reject) => {
        resolve(params);
      });
    }
  };

  const esvFetch = (passage) => {
    return new Promise((resolve, reject) => {
      resolve('passage text');
    });
  };

  const recipients = [...Array(2).keys()].map((i) => {
    return {
      name: `Recipient ${i}`,
      email: `recipient.${i}@email.com`
    };
  });

  co(function*() {
    yield sendLogic(upcoming, recipients, config, atDate, emailer, esvFetch);
    t.equal(
      emailer.loggedParams.length,
      2,
      'Should have sent 18 requests');

    t.deepEqual(
      emailer.loggedParams.map(p => {return p.to}),
      ['Recipient 0 <recipient.0@email.com>', 'Recipient 1 <recipient.1@email.com>'],
      'Should have sent to correct recipients');
  }).catch(err => {
    console.error(err.stack);
    t.fail();
  });
});
