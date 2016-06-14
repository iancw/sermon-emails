'use strict';

const fs = require('fs');

function buildSubject(upcoming) {
  return `Sermon for ${upcoming.date}: ${upcoming.title}`;
}

function getCss() {
  return fs.readFileSync('styles/mail.css', 'utf8');
}

function buildBody(body) {
  return `<!DOCTYPE html>
<html>
  <head>
    <style>
      ${getCss()}
    </style>
  </head>
  <body>
    ${body}
  </body>
</html>`;
}

function buildMessage(upcoming, text) {
  return {
    subject: buildSubject(upcoming),
    bodyHtml: buildBody(text)
  };
}

module.exports = buildMessage;
