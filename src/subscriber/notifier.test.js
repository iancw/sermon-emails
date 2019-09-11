const ava = require('ava').serial;
const nock = require('nock');

const {notify} = require('./notifier');
const moment = require('moment');
process.env.FROM_EMAIL='fromy@from.from';
process.env.REGION='us-east-1';
process.env.UPCOMING_BUCKET='bucket';
process.env.UPCOMING_KEY='upcoming.json';
process.env.ESV_KEY='fake-key';

ava.beforeEach(() => nock.disableNetConnect());

ava.afterEach(() => nock.cleanAll());

ava('notify removal', async (t) => {
    const emailSent = nock(`https://email.us-east-1.amazonaws.com:443`)
        .post('/')
        .reply(200);

    t.is(
        await notify('from@fromy.from')({action:"REMOVE",recipient:{name:"Doesnt matter",email:"bye@good.bye"}}),
        'Bade farewell to Doesnt matter'
    );

    t.is(
        emailSent.isDone(),
        true
    );
});

ava('notify addition', async (t) => {
    const sentBothEmails = nock(`https://email.us-east-1.amazonaws.com:443`)
        .post('/')
        .times(2)
        .reply(200);

    nock('https://bucket.s3.amazonaws.com:443')
        .get('/upcoming.json')
        .reply(200, [{
            date: moment.tz().add('1 day').format('MMMM D'),
            passage: 'Psalm 1',
            title: 'Sermon title',
            preacher: 'Richard Sibbes'
        }]);

    const queriedPassage = nock('http://www.esvapi.org:80')
        .filteringPath((path) => '/v2/rest/passageQuery')
        .get('/v2/rest/passageQuery')
        .reply(200, 'Lorem ipsum');

    t.is(
        await notify('from@fromy.from')({
            action:"ADD",
            recipient:{name:"Doesnt matter",email:"hi@hello.hi"}
        }),
        'Welcomed Doesnt matter'
    );

    t.is(
        sentBothEmails.isDone(),
        true
    );

    t.is(
        queriedPassage.isDone(),
        true
    );
});
