'use strict';

const tape = require('tape');
const findUpcoming = require('./find-upcoming');
const moment = require('moment');

tape('test find upcoming', (t) => {
  const upcoming = [
    {date:'January 3',passage:'Luke 18:9-30'},
    {date:'January 17',passage:'Luke 18:31-19:44'},
  ];
  t.deepEqual(
    findUpcoming(moment('2016-01-01'), upcoming),
    upcoming[0],
    'Should select Jan 3 sermon when current date is Jan 1'
  );
  t.deepEqual(
    findUpcoming(moment('2016-01-04'), upcoming),
    upcoming[1],
    'Should select Jan 17 sermon when current date is Jan 4'
  );
  t.deepEqual(
    findUpcoming(moment('2016-01-03'), upcoming),
    upcoming[0],
    'Should select Jan 3 sermon when current date is Jan 3'
  );
  t.equal(
    findUpcoming(moment('2016-01-18'), upcoming),
    undefined,
    'Should return undefined when no sermons defined beyond current date'
  );
  t.end();
});
