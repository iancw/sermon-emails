const ava = require('ava');
const buildEmail = require('.');

ava('Builds messages', async (t) => {
    const email = await buildEmail({
        upcoming: [
            { date: new Date('2020-01-03'), passage: 'Luke 18:9-30', preacher: 'John Doe', title: 'Jan sermon' },
            { date: new Date('2020-01-17'), passage: 'Luke 18:31-19:44', preacher: 'Richard Sibbes', title: 'Second sermon in Jan' },
            { date: new Date('2020-04-01'), passage: 'Psalm 1:1', preacher: 'John Calvin', title: 'A sermon for April'}
        ],
        config: {
            timeZone: 'America/New_York',
            fromName: 'Fromy Foo',
            fromEmail: 'foo@foo.foo',
        },
        atDate: new Date('2020-02-02'),
        esv: {
            read: (passage) => `Lorem ipsum text for ${passage} ... `
        }
    });

    t.snapshot(email);
});
