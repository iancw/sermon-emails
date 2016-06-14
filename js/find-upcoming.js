'use strict';

const moment = require('moment');

function momentify(dateStr) {
  return moment(dateStr, 'MMMM D');
}

function compareDates(a, b) {
  const aDate = momentify(a.date);
  const bDate = momentify(b.date);
  if (aDate.isBefore(bDate)) {
    return -1;
  }
  if (aDate.isAfter(bDate)) {
    return 1;
  }
  return 0;
}

function findUpcoming(date, upcoming) {
  for (let sermon of upcoming) {
    const sermonDate = momentify(sermon.date);
    //console.log(`comparing sermon date of ${sermonDate.format('MMMM D YYYY')} to current date of ${date.format('MMMM D YYYY')}`);
    if (sermonDate.isSameOrAfter(date)) {
      return sermon;
    }
  }
  return undefined;
}

module.exports = findUpcoming;
