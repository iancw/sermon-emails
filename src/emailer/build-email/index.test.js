const ava = require('ava');
const moment = require('moment-timezone');

const buildEmail = require('.');

ava('Builds messages', async (t) => {
    const email = await buildEmail({
        upcoming: [
            { date: 'January 3', passage: 'Luke 18:9-30', title: 'Jan sermon' },
            { date: 'January 17', passage: 'Luke 18:31-19:44', title: 'Second sermon in Jan' },
            { date: 'April 1', passage: 'Psalm 1:1', title: 'A sermon for April'}
        ],
        config: {
            timeZone: 'America/New_York',
            fromName: 'Fromy Foo',
            fromEmail: 'foo@foo.foo',
        },
        atDate: moment.tz('February 2', 'MMMM D', 'America/New_York'),
        esv: {
            read: (passage) => `Lorem ipsum text for ${passage} ... `
        }
    });

    t.snapshot(email);
});
