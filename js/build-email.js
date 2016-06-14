'use strict';

function buildEmail(args) {
  return `From: ${args.from.name} <${args.from.email}>
To: ${args.to.name} <${args.to.email}>
MIME-Version: 1.0
Content-type: text/html
Subject: ${args.subject}

${args.body}

`;
}

module.exports = buildEmail;
