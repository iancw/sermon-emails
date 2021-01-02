/*
 * This onData handler is lifted from the JS on the CHBC upcoming sermons page.
 * https://www.capitolhillbaptist.org/upcoming-sermons/
*/
function onData(data) {
    var rawSermons = {};
    var sermons = [];
    var today = new Date();

  data.feed.entry.forEach(function(element) {
      var cell = element.gs$cell;

      if (!rawSermons[cell.row]) {
        rawSermons[cell.row] = {};
      }

      switch (cell.col) {
        case "2":
          rawSermons[cell.row].title = cell.$t;
          break;
        case "3":
          rawSermons[cell.row].series_sub = cell.$t;
          break;
        case "4":
          rawSermons[cell.row].series = cell.$t;
          break;
        case "5":
          rawSermons[cell.row].speaker = cell.$t;
          break;
        case "8":
          rawSermons[cell.row].scripture = cell.$t;
          break;
        case "9":
          rawSermons[cell.row].rawDate = cell.$t;
          var matches = cell.$t.match(/(\d+)-(\w+)-(\d+)/);
           
          // Setting hours to 19 allows the date to match in Eastern Time, even when
          // downstream consumers forget to output the date related to UTC
          var d = new Date(`${matches[2]} ${matches[1]} 20${matches[3]} 19:00:00 UTC`);
          rawSermons[cell.row].date = d;
          break;
      }
  });

  for (var i in rawSermons) {
    var s = rawSermons[i];
    if (s.date > today && s.title && s.title != "") {
      sermons.push(s);
    }
  }

  return sermons.sort((a, b) => a.date - b.date);
}

module.exports = onData;