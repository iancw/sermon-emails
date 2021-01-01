const ava = require('ava').serial;
const nock = require('nock');

const {handler} = require('./index');

const bucket = 'bucket';
const key = 'key';
process.env.RECIPIENTS_BUCKET=bucket;
process.env.RECIPIENTS_KEY=key;
process.env.FROM_EMAIL='fromy@from.from';
process.env.REGION='us-east-1';
process.env.ACCESS_KEY_ID='ACCESS_KEY_ID';
process.env.SECRET_ACCESS_KEY='SECRET_ACCESS_KEY';
process.env.UPCOMING_BUCKET='bucket';
process.env.UPCOMING_KEY='upcoming.json';
process.env.ESV_KEY='fake-key';

ava.beforeEach(() => nock.disableNetConnect());

ava.afterEach(() => nock.cleanAll());

ava.skip('Adding new record', async (t) => {
    nock(`https://${bucket}.s3.amazonaws.com:443`)
        .get(`/upcoming.json`)
        .reply(200, [{
        date: (() => {let a = new Date(); a.setDate(a.getDate() + 1); return a;})(),
        passage: 'Psalm 1',
        title: 'Sermon title',
        preacher: 'Richard Sibbes'
    }])
    .get(`/key`)
    .reply(200, [])
    .put(`/key`)
    .reply(200, '');

    const bothEmailsSent = nock(`https://email.us-east-1.amazonaws.com:443`)
        .post('/')
        .times(2)
        .reply(200);

    nock('http://www.esvapi.org:80')
        .filteringPath((path) => '/v2/rest/passageQuery')
        .get('/v2/rest/passageQuery')
        .reply(200, 'Lorem ipsum');

    t.deepEqual(
        await handler({
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
        }),
        {
            statusCode: 200,
            body: 'Welcomed Jane Doe'
        }
    );

    t.is(
        bothEmailsSent.isDone(),
        true
    );
});

ava('Adding duplicate record', async (t) => {

    nock(`https://${bucket}.s3.amazonaws.com:443`)
        .get(`/${key}`)
        .reply(200, [{
            name: 'Doesnt matter',
            email: 'janedoe@example.com',
        }]);

    nock(`https://${bucket}.s3.amazonaws.com:443`)
      .put(`/${key}`)
      .reply(200, '');

    t.deepEqual(
        await handler({
            Records: [{
                ses: {
                    mail: {
                        commonHeaders: {
                            subject: 'subscribe',
                            from: [
                                'Jan Doe <janedoe@example.com>'
                            ]
                        }
                    }
                }
            }]
        }),
        {
            statusCode: 200,
            body: '',
        }
    );
});


ava('Removing existing record', async (t) => {

    nock(`https://${bucket}.s3.amazonaws.com:443`)
        .get(`/key`)
        .reply(200, [{
            name: 'Doesnt matter',
            email: 'janedoe@example.com',
        }]);

    nock(`https://${bucket}.s3.amazonaws.com:443`)
        .put(`/key`)
        .reply(200, '');

    const emailSent = nock(`https://email.us-east-1.amazonaws.com:443`)
        .post('/')
        .reply(200);

    t.deepEqual(
        await handler({
            Records: [{
                ses: {
                    mail: {
                        commonHeaders: {
                            subject: 'unsubscribe',
                            from: [
                                'Jan Doe <janedoe@example.com>'
                            ]
                        }
                    }
                }
            }]
        }),
        {
            statusCode: 200,
            body: 'Bade farewell to Doesnt matter'
        }
    );

    t.is(
        emailSent.isDone(),
        true
    );
});
