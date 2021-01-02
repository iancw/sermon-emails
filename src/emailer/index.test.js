const ava = require('ava').serial;
const nock = require('nock');
require('dotenv').config();

const {handler} = require('.');

nock.back.fixtures = __dirname + '/nockFixtures';

ava.beforeEach(async (t) => {
    // Set mode to 'record' and run once after setting up .env properly
    // Note! This _will_ actually send an email when run in 'record' mode. So set up
    // RECIPIENTS_KEY to point to a test file rather than the real list of recipients
    nock.back.setMode('lockdown');
    const {nockDone} = await nock.back('emailer.json');

    t.context.nockDone = nockDone;
});

ava.afterEach((t) => {
    t.context.nockDone();
    nock.back.setMode('wild');
});

ava('Sends emails', async (t) => {
    const result = await handler();
    t.deepEqual(
        result,
        {
            statusCode: 200,
            body: `Sent 1 emails`,
        }
    );
})
