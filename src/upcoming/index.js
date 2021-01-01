const fetchFromSheets = require('./fetch-from-sheets');
const grabSortedSermons = require('./grab-sorted-sermons');

const remapFields = (s) => ({
    passage: s.scripture,
    preacher: s.speaker,
    title: s.title,
    date: s.date,
    rawDate: s.rawDate,
});

const readUpcoming = async () => {
    const data = await fetchFromSheets();
    const sermons = grabSortedSermons(data);

    return sermons.map(remapFields);
};

module.exports = {
    readUpcoming,
};