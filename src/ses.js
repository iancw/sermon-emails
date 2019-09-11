const AWS = require('aws-sdk');

const getSES = () => new AWS.SES({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.REGION,
    apiVersion: '2010-12-01'
});

function toAWSParams(params) {
  return {
    Source: params.from,
    Destination: {
      ToAddresses: [params.to]
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
function send(params) {
    const ses = getSES();
    return ses.sendEmail(toAWSParams(params)).promise();
}

module.exports = {
    send,
};

