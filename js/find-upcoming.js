'use strict';

const moment = require('moment-timezone');

function findUpcoming(searchDate, upcoming, tz) {
  let myTz = tz;
  if (tz === undefined) {
    myTz = 'America/New_York';
  }
  const searchDateInMyTz = searchDate.clone().tz(myTz);
  for (let sermon of upcoming) {
    const sermonDate = moment.tz(sermon.date, 'MMMM D', myTz).endOf('day');
    if (sermonDate.isSameOrAfter(searchDateInMyTz)) {
      return sermon;
    }
  }
  return undefined;
}

module.exports = findUpcoming;
