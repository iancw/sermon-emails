const moment = require('moment-timezone');

function momentify(dateStr) {
  return moment(dateStr, 'MMMM D');
}

function compareSermonsByDate(a, b) {
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


module.exports = compareSermonsByDate;
