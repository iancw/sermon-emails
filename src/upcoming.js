const s3 = require('./s3');

const readUpcoming = async () => JSON.parse(await s3.get({
    Bucket: process.env.UPCOMING_BUCKET,
    Key: process.env.UPCOMING_KEY,
})).sort((a, b) => new Date(a.date) - new Date(b.date));


module.exports = {
    readUpcoming,
};
