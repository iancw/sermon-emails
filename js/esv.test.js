'use strict';

const tape = require('tape');
const esv = require('./esv');
const nock = require('nock');

tape('test esv api', function(t) {
  nock('http://www.esvapi.org')
    .get(/.v2.rest.passageQuery.*/)
    .reply(200, 'passage text');

  t.plan(1);
  esv.fetchPassage('Luke 2', 'IP').then(res => {
    t.equal(res, 'passage text');
  }).catch((err) => {
    console.log(err.stack);
    t.fail(err)
  });
});
