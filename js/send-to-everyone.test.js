'use strict';

const tape = require('tape');
const sendToEveryone = require('./send-to-everyone');

tape('test sending to one person', function(t) {
  const template = {
    from: 'Anyone <anyone@anyone.com>',
    subject: 'Subject',
    bodyHtml: 'Body'
  };

  const emailer = {
    templates: [],
    send: function(params) {
      this.templates.push(params)
    }
  };

  const recipients = [{
    name: 'Name',
    email: 'email@email.com'
  }];

  sendToEveryone(emailer, template, recipients);

  t.equal(emailer.templates.length, 1, 'Should have called send once');
  t.equal(emailer.templates[0].to, 'Name <email@email.com>', 'Should email the right person');
  t.end();
});

tape('test sending to two people', function(t) {
  const template = {
    from: 'Anyone <anyone@anyone.com>',
    subject: 'Subject',
    bodyHtml: 'Body'
  };

  const emailer = {
    templates: [],
    send: function(params) {
      this.templates.push(params)
    }
  };

  const recipients = [
    {
      name: 'Person 1',
      email: 'person1@email.com'
    },
    {
      name: 'Person 2',
      email: 'person2@email.com'
    },
  ];

  sendToEveryone(emailer, template, recipients);

  t.equal(emailer.templates.length, 2, 'Should have called send twice');
  t.equal(emailer.templates[0].to, 'Person 1 <person1@email.com>', 'First email should go to correct person');
  t.equal(emailer.templates[1].to, 'Person 2 <person2@email.com>', 'Second email should go to correct person');
  t.equal(template.to, undefined, 'Template should not be modified');
  t.end();
});
