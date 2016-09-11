'use strict';

const tape = require('tape');
const findUpcoming = require('./find-upcoming');
const moment = require('moment-timezone');

tape('test find upcoming', (t) => {
  const upcoming = [
    {date:'January 3',passage:'Luke 18:9-30'},
    {date:'January 17',passage:'Luke 18:31-19:44'},
  ];
  t.deepEqual(
    findUpcoming(moment('2016-01-01'), upcoming, 'America/New_York').date,
    'January 3',
    'Should select Jan 3 sermon when current date is Jan 1'
  );
  t.deepEqual(
    findUpcoming(moment('2016-01-04'), upcoming, 'America/New_York').date,
    'January 17',
    'Should select Jan 17 sermon when current date is Jan 4'
  );
  t.deepEqual(
    findUpcoming(moment('2016-01-03'), upcoming, 'America/New_York').date,
    'January 3',
    'Should select Jan 3 sermon when current date is Jan 3'
  );
  t.equal(
    findUpcoming(moment('2016-01-18'), upcoming, 'America/New_York'),
    undefined,
    'Should return undefined when no sermons defined beyond current date'
  );
  t.equal(
    findUpcoming(moment('2016-01-03T13:48:34-04:00').tz('Australia/Perth'), upcoming, 'America/New_York').date,
    'January 3',
    'Should find upcoming sermon, even when date supplied is from a timezone with a different day');

  t.equal(
    findUpcoming(moment('2016-01-03T13:48:34-04:00').tz('Australia/Perth'), upcoming, 'Australia/Perth').date,
    'January 17',
    'Should find next sermon if your dates are specified in Perth zone');
  t.end();
});
