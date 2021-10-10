function startOfDay(date) {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();
  return new Date(Date.UTC(year, month, day, 0, 0, 0))
}

function findUpcoming(searchDate, upcoming) {
  for (let sermon of upcoming) {
    if (startOfDay(new Date(sermon.date)) >= startOfDay(searchDate)) {
      return sermon;
    }
  }
  return undefined;
}

module.exports = findUpcoming;
