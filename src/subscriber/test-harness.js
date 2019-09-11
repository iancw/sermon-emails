const {handler} = require('./index');
const nock = require('nock');
require('dotenv').config();

nock.recorder.rec()

handler({
    Records: [{
        ses: {
            mail: {
                commonHeaders: {
                    subject: 'subscribe',
                    from: [
                        'Jane Doe <janedoe@example.com>'
                    ]
                }
            }
        }
    }]
});
