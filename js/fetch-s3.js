'use strict';

const AWS = require('aws-sdk');
const awsConfig = require('./_ses_private');

module.exports = fetchS3;

function* fetchS3(opts) {
  const s3 = new AWS.S3({
    accessKeyId: awsConfig.AccessKeyId,
    secretAccessKey: awsConfig.SecretAccessKey
  });
  return yield function(cb) {
    s3.getObject({
      Bucket: opts.bucket,
      Key: opts.key,
    }, function(err, data) {
      if (err) {
        cb(err, data);
      } else {
        cb(null, data.Body);
      }
    });
  }
}
