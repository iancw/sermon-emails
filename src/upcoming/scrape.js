const {readUpcoming} = require('.');

const convertToLegacyDates = async () => {
    const newUpcoming = await readUpcoming();
    return newUpcoming.map((s) => {
        const formattedDate = s.date.toLocaleDateString("en-US", {month: 'long', day: 'numeric', timeZone: 'UTC'});
        return {
            ...s,
            date: formattedDate,
        };
    })
}

convertToLegacyDates().then(arr => console.log(JSON.stringify(arr, null, 2)));

