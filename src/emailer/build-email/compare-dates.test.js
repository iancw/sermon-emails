const ava = require('ava');
const compareDates = require('./compare-dates');

ava('test comparing dates', (t) => {
  t.is(compareDates({ date: 'January 3' }, { date: 'January 17' }),
    -1,
    'Jan 3 should be before Jan 17'
  );

  t.is(compareDates({ date: 'March 17' }, { date: 'February 2' }),
    1,
    'March 17 should be after Feb 3'
  );
  t.is(compareDates({ date: 'March 17' }, { date: 'March 17' }),
    0,
    'March 17 should be equal to March 17'
  );

  const sorted = [
    { date: 'January 3' },
    { date: 'January 17' },
    { date: 'February 2' },
    { date: 'March 17' },
    { date: 'December 14' }
  ];
  const unsorted = [
    { date: 'December 14' },
    { date: 'January 3' },
    { date: 'January 17' },
    { date: 'March 17' },
    { date: 'February 2' }
  ];
  t.deepEqual(
    unsorted.sort(compareDates),
    sorted,
    'Sorting by comparator should produce sorted dates'
  );
});
