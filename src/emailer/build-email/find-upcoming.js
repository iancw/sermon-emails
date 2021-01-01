function findUpcoming(searchDate, upcoming) {
  for (let sermon of upcoming) {
    if (sermon.date >= searchDate) {
      return sermon;
    }
  }
  return undefined;
}

module.exports = findUpcoming;
