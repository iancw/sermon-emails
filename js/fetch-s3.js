'use strict';

const AWS = require('aws-sdk');

module.exports = fetchS3;

function* fetchS3(opts) {
  const s3 = new AWS.S3();
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
