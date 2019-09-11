const ava = require('ava');
const moment = require('moment-timezone');
const findUpcoming = require('./find-upcoming');

ava('Should select Jan 3 sermon when current date is Jan 1', (t) => {
  t.deepEqual(
    findUpcoming(
      moment.tz('January 1', 'MMMM D', 'America/New_York'),
      [
        { date: 'January 3', passage: 'Luke 18:9-30' },
        { date: 'January 17', passage: 'Luke 18:31-19:44' },
      ],
      'America/New_York'
    ).date,
    'January 3',
  );
});

ava('Should select Jan 17 sermon when current date is Jan 4', (t) => {
  t.deepEqual(
    findUpcoming(
      moment.tz('January 4', 'MMMM D', 'America/New_York'),
      [
        { date: 'January 3', passage: 'Luke 18:9-30' },
        { date: 'January 17', passage: 'Luke 18:31-19:44' },
      ],
      'America/New_York'
    ).date,
    'January 17',
  );
});

ava('others', (t) => {
  const upcoming = [
    { date: 'January 3', passage: 'Luke 18:9-30' },
    { date: 'January 17', passage: 'Luke 18:31-19:44' },
  ];

  t.deepEqual(
    findUpcoming(moment.tz('January 3', 'MMMM D', 'America/New_York'), upcoming, 'America/New_York').date,
    'January 3',
    'Should select Jan 3 sermon when current date is Jan 3'
  );
  t.is(
    findUpcoming(moment.tz('January 18', 'MMMM D', 'America/New_York'), upcoming, 'America/New_York'),
    undefined,
    'Should return undefined when no sermons defined beyond current date'
  );
  t.is(
    findUpcoming(moment.tz('January 3', 'MMMM D', 'Australia/Perth'), upcoming, 'America/New_York').date,
    'January 3',
    'Should find upcoming sermon, even when date supplied is from a timezone with a different day');
});

ava('Should find next sermon if your dates are specified in Perth zone', (t) => {
  t.is(
    findUpcoming(
      moment.tz('January 3', 'MMMM D', 'Australia/Perth'),
      [
        { date: 'January 3', passage: 'Luke 18:9-30' },
        { date: 'January 17', passage: 'Luke 18:31-19:44' },
      ],
      'Australia/Perth'
    ).date,
    'January 3'
  );
});
