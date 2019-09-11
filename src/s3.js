const AWS = require('aws-sdk');
const memoize = require('./memoize');

const getS3 = memoize(() => new AWS.S3({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
}));

const get = (opts) => {
    const s3 = getS3();
    return new Promise((resolve, reject) => {
        s3.getObject(opts, function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data.Body);
            }
        });
    });
}

const put = (opts) => {
    const s3 = getS3();
    return new Promise((resolve, reject) => {
        s3.putObject(opts, function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data.Body);
            }
        });
    });
};

module.exports = {
    get,
    put,
};


