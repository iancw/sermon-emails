'use strict';

const tape = require('tape');
const buildEmail = require('./build-email');

tape('test build-email', function(t) {
  t.equal(
    buildEmail({
    from: {
      name: 'Sender Name',
      email: 'sender.name@email.com'
    },
    to: {
      name: 'Recipient Name',
      email: 'recipient.name@email.com'
    },
    subject: 'Subject',
    body: 'Message Body'
  }),
  `From: Sender Name <sender.name@email.com>
To: Recipient Name <recipient.name@email.com>
MIME-Version: 1.0
Content-type: text/html
Subject: Subject

Message Body

`,
  'buildEmail should return correct email body');
  t.end();
});
