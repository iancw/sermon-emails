const ava = require('ava');
const {readUpcoming} = require('.');

ava('It reads upcoming sermons correctly', async (t) => {
    t.deepEqual(
        [{
            date: new Date('2020-12-27T19:00:00.000Z'),
            passage: 'Isaiah 22',
            title: '2020 Vision',
            preacher: 'Caleb Morell',
        }],
        await readUpcoming()
    );
});