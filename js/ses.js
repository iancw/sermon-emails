'use strict';

const AWS = require('aws-sdk');
const sesConfig = require('./_ses_private.json');

function makeSES() {
  return new AWS.SES({
    accessKeyId: sesConfig.AccessKeyId,
    secretAccessKey: sesConfig.SecretAccessKey,
    region: sesConfig.Region,
    apiVersion: '2010-12-01'
  });
}

function toAWSParams(params) {
  return {
    Source: params.from,
    Destination: {
      ToAddresses: params.to
    },
    Message: {
      Body: {
        Html: {
          Data: params.bodyHtml,
          Charset: 'utf8'
        },
      },
      Subject: {
        Data: params.subject
      }
    }
  };
}

/*
 * params should contain the following fields
 *  - from (email address)
 *  - to (destination address)
 *  - bodyHtml (html contents of email)
 *  - subject (subject link of email)
 */
function sendWithSes(ses, params) {
  return ses.sendEmail(toAWSParams(params), (err, data) => {
    if (err) {
      console.log(err, err.stack);
    } else {
      console.log(data);
    }
  });
}

module.exports = {
  create: () => {
    const ses = makeSES();
    return {
      send: sendWithSes.bind(sendWithSes, ses)
    };
  }
}

