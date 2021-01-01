const ava = require('ava').serial;
const nock = require('nock');
const path = require('path');
require('dotenv').config();

const {handler} = require('.');

nock.back.fixtures = path.join(__dirname, '..', '..', 'fixtures');

ava.beforeEach(async (t) => {
    nock.back.setMode('lockdown');
    const {nockDone} = await nock.back('emailer.json');

    t.context.nockDone = nockDone;
});

ava.afterEach((t) => {
    t.context.nockDone();
    nock.back.setMode('wild');
});

ava.skip('Sends emails', async (t) => {
    const result = await handler();
    t.deepEqual(
        result,
        {
            statusCode: 200,
            body: `Sent 1 emails`,
        }
    );
})
