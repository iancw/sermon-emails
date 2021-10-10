function findUpcoming(searchDate, upcoming) {
  for (let sermon of upcoming) {
    if (new Date(sermon.date) >= searchDate) {
      return sermon;
    }
  }
  return undefined;
}

module.exports = findUpcoming;
