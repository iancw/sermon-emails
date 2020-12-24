const {updateRecipients} = require('./subscriber');
const {readRecipients, writeRecipients} = require('../recipients');
const {notify} = require('./notifier');

module.exports.handler = async (event) => {
    const priorRecipients = await readRecipients();
    const {effects, recipients} = updateRecipients({recipients: priorRecipients, event});
    await writeRecipients(recipients);

    const notifications = await Promise.all(effects.map(notify(process.env.FROM_EMAIL)));

    const response = {
        statusCode: 200,
        body: notifications.join(', ')
    };
    return response;
};
