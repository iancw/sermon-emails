'use strict';

const co = require('co');
const sendEmails = require('./send-emails');


module.exports = {
  handler: function(event, context) {
    console.log('Received event from AWS Lambda:', JSON.stringify(event, null, 2));
    co(function*() {
      yield sendEmails();
      context.succeed();
    }).catch(err => {
      console.error(err.stack);
      context.fail();
    });
  }
}

