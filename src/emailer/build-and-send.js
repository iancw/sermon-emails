const {send} = require('../ses');
const buildEmail = require('./build-email');
const esv = require('./esv');
const {readUpcoming} = require('../upcoming');

const buildAndSend = async (recipients) => {
    const emailTemplate = await buildEmail({
        upcoming: await readUpcoming(),
        config: {
            timeZone: process.env.TIME_ZONE,
            fromName: process.env.FROM_NAME,
            fromEmail: process.env.FROM_EMAIL,
        },
        atDate: new Date(),
        esv,
    });

    const eachEmail = recipients.map(({name, email}) => {
        return {
            ...emailTemplate,
            to: `${name} <${email}>`
        }
    });

    return await Promise.all(eachEmail.map(params => send(params)));
}

module.exports = buildAndSend;
