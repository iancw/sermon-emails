'use strict';

const fs = require('fs');

function buildSubject(upcoming) {
  return `Sermon for ${upcoming.date}: ${upcoming.title}`;
}

function getCss() {
  return fs.readFileSync('styles/mail.css', 'utf8');
}

function buildPreacher(preacher) {
  if (preacher) {
    return `<h2>${preacher}</h2>`
  }
  return '';
}

function buildBody(body, preacher) {
  return `<!DOCTYPE html>
<html>
  <head>
    <style>
      ${getCss()}
    </style>
  </head>
  <body>
    ${buildPreacher(preacher)}
    ${body}
  </body>
</html>`;
}

function buildMessage(upcoming, text) {
  return {
    subject: buildSubject(upcoming),
    bodyHtml: buildBody(text, upcoming.preacher)
  };
}

module.exports = buildMessage;
