const ava = require('ava');
const nock = require('nock');
const setupNock = require('./nock.rec.js');

const {readUpcoming} = require('.');

ava.beforeEach(() => nock.disableNetConnect());

ava.afterEach(() => nock.cleanAll());

ava('It reads upcoming sermons correctly', async (t) => {
    setupNock();
    t.snapshot(await readUpcoming());
});