const {readRecipients} = require('../recipients');
const buildAndSend = require('./build-and-send');

const handler = async (event, context) => {
    const recipients = await readRecipients();
    const results = await buildAndSend(recipients);

    const response = {
        statusCode: 200,
        body: `Sent ${results.length} emails`
    };
    return response;
};

module.exports = {
    handler,
    buildAndSend,
};
