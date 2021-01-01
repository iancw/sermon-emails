const s3 = require('../s3');

const readUpcoming = async () => JSON.parse(await s3.get({
    Bucket: process.env.UPCOMING_BUCKET,
    Key: process.env.UPCOMING_KEY,
}));

module.exports = {
    readUpcoming,
};
