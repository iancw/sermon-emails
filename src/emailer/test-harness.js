const {handler} = require('.');
const nock = require('nock');

require('dotenv').config();

nock.recorder.rec();

handler();
