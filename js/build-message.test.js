'use strict';

const tape = require('tape');
const buildMessage = require('./build-message');
const _ = require('lodash');

tape('test build-message', function(t) {
  const message = buildMessage({
      date: 'January 3',
      passage: 'Luke 18:9-30',
      title: 'Sermon Title'
    }, 'Some biblical text');
  t.deepEqual(message.subject,'Sermon for January 3: Sermon Title');
  t.equal(_.includes(message.bodyHtml, 'Some biblical text'), true, `Message body should contain text, but was '${message.body}'`);
  t.end();
});
