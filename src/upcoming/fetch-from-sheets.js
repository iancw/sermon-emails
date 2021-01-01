const got = require('got');

/*
 * These calculations were lifted from the JS on the CHBC upcoming sermons page.
 * https://www.capitolhillbaptist.org/upcoming-sermons/
*/
const calculateStartRow = () => {
    //1498 = 2018-01-07
    var ONE_WEEK = 1000 * 60 * 60 * 24 * 7;
    var startDate = new Date(2018, 1, 7, 0, 0, 0);
    var today = new Date();
    var difference_ms = Math.abs(today.getTime() - startDate.getTime());
    var startRow = 1498 + Math.floor(difference_ms / ONE_WEEK);
    return startRow;
}

const fetchFromSheets = async () => {
    const result = await got(
        `https://spreadsheets.google.com/feeds/cells/1l_-TU8h-bE6O27HIBF9FRl5OwFfGmDxDzWUxtnB5UHQ/1/public/values?alt=json&min-col=2&max-col=9&min-row=${calculateStartRow()}`,
        {responseType: 'json'}
    );

    return JSON.parse(result.body);
}

module.exports = fetchFromSheets;