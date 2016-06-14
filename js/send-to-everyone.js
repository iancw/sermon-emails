'use strict';

function sendToEveryone(emailer, paramTemplate, recipients) {
  return recipients.map(function(recipient) {
    const params = Object.assign({}, paramTemplate);
    params.to = `${recipient.name} <${recipient.email}>`;
    return emailer.send(params);
  });
}

module.exports = sendToEveryone;
