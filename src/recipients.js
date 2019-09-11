const s3 = require('./s3');

const readRecipients = async () => JSON.parse(await s3.get({
    Bucket: process.env.RECIPIENTS_BUCKET,
    Key: process.env.RECIPIENTS_KEY,
}));

const writeRecipients = (newList) => s3.put({
    Bucket: process.env.RECIPIENTS_BUCKET,
    Key: process.env.RECIPIENTS_KEY,
    Body: JSON.stringify(newList),
});

module.exports = {
    readRecipients,
    writeRecipients,
};
