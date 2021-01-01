const ava = require('ava');
const findUpcoming = require('./find-upcoming');

ava('Should select Jan 3 sermon when current date is Jan 1', (t) => {
  t.deepEqual(
    findUpcoming(
      new Date('2020-01-01'),
      [
        { date: new Date('2020-01-03'), passage: 'Luke 18:9-30' },
        { date: new Date('2020-01-17'), passage: 'Luke 18:31-19:44' },
      ],
    ).date,
    new Date('2020-01-03'),
  );
});

ava('Should select Jan 17 sermon when current date is Jan 4', (t) => {
  t.deepEqual(
    findUpcoming(
      new Date('2020-01-04'),
      [
        { date: new Date('2020-01-03'), passage: 'Luke 18:9-30' },
        { date: new Date('2020-01-17'), passage: 'Luke 18:31-19:44' },
      ],
    ).date,
    new Date('2020-01-17'),
  );
});

ava('others', (t) => {
  const upcoming = [
    { date: new Date('2020-01-03'), passage: 'Luke 18:9-30' },
    { date: new Date('2020-01-17'), passage: 'Luke 18:31-19:44' },
  ];

  t.deepEqual(
    findUpcoming(new Date('2020-01-03'), upcoming, 'America/New_York').date,
    new Date('2020-01-03'),
    'Should select Jan 3 sermon when current date is Jan 3'
  );
  t.is(
    findUpcoming(new Date('2020-01-18'), upcoming, 'America/New_York'),
    undefined,
    'Should return undefined when no sermons defined beyond current date'
  );
  t.deepEqual(
    findUpcoming(new Date('2020-01-03'), upcoming, 'America/New_York').date,
    new Date('2020-01-03'),
    'Should find upcoming sermon, even when date supplied is from a timezone with a different day');
});

ava('Should find next sermon if your dates are specified in Perth zone', (t) => {
  t.deepEqual(
    findUpcoming(
      new Date('2020-01-03'),
      [
        { date: new Date('2020-01-03'), passage: 'Luke 18:9-30' },
        { date: new Date('2020-01-17'), passage: 'Luke 18:31-19:44' },
      ],
    ).date,
    new Date('2020-01-03')
  );
});
