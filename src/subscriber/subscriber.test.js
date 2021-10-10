const ava = require('ava');

const { updateRecipients } = require('./subscriber');

ava('updateRecipients - remove two', (t) => {
    const {effects, recipients} = updateRecipients({
        recipients: [
            { name: 'One', email: 'one@one.com' },
            { name: 'Two two', email: 'two@two.com' },
            { name: 'Three three', email: 'three@three.com' },
        ],
        event: {
            Records: [
                {
                    ses: {
                        mail: {
                            commonHeaders: {
                                subject: 'Unsubscribe',
                                from: [
                                    'Name Schmame <one@one.com>'
                                ]
                            }
                        }
                    }
                },
                {
                    ses: {
                        mail: {
                            commonHeaders: {
                                subject: 'Unsubscribe',
                                from: [
                                    'Name Schmame <two@two.com>'
                                ]
                            }
                        }
                    }
                }
            ]
        }
    });

    t.deepEqual(
        recipients,
        [
            { name: 'Three three', email: 'three@three.com' },
        ]
    );

    t.deepEqual(
        effects,
        [
            { action: 'REMOVE', recipient: { name: 'One', email: 'one@one.com' }},
            { action: 'REMOVE', recipient: { name: 'Two two', email: 'two@two.com' }},
        ]
    );
})

ava('updateRecipients - add', (t) => {
    const {effects, recipients} = updateRecipients({
        recipients: [
            { name: 'One', email: 'one@one.com' },
            { name: 'Two two', email: 'two@two.com' },
            { name: 'Three three', email: 'three@three.com' },
        ],
        event: {
            Records: [
                {
                    ses: {
                        mail: {
                            commonHeaders: {
                                subject: 'subscribe',
                                from: [
                                    'Name Schmame <new@new.com>'
                                ]
                            }
                        }
                    }
                },
                {
                    ses: {
                        mail: {
                            source: 'another@anon.com',
                            commonHeaders: {
                                subject: 'subscribe',
                            }
                        }
                    }
                },
            ]
        }
    });

    t.deepEqual(
        recipients,
        [
            { name: 'One', email: 'one@one.com' },
            { name: 'Two two', email: 'two@two.com' },
            { name: 'Three three', email: 'three@three.com' },
            { name: 'Name Schmame', email: 'new@new.com', dateAdded: new Date().toISOString().slice(0, 10)},
            { name: undefined, email: 'another@anon.com', dateAdded: new Date().toISOString().slice(0, 10)},
        ]
    );

    t.deepEqual(
        effects,
        [
            { action: 'ADD', recipient:  { name: 'Name Schmame', email: 'new@new.com', dateAdded: new Date().toISOString().slice(0, 10)},},
            { action: 'ADD', recipient: { name: undefined, email: 'another@anon.com', dateAdded: new Date().toISOString().slice(0, 10)}},
        ]
    );
});

ava('updateRecipients - attempt to add duplicate', (t) => {
    const {effects, recipients} = updateRecipients({
        recipients: [
            { name: 'One', email: 'one@one.com' },
            { name: 'Two two', email: 'two@two.com' },
            { name: 'Three three', email: 'three@three.com' },
        ],
        event: {
            Records: [
                {
                    ses: {
                        mail: {
                            commonHeaders: {
                                subject: 'subscribe',
                                from: [
                                    'Name Schmame <one@one.com>'
                                ]
                            }
                        }
                    }
                },
            ]
        }
    });

    t.deepEqual(
        recipients,
        [
            { name: 'One', email: 'one@one.com' },
            { name: 'Two two', email: 'two@two.com' },
            { name: 'Three three', email: 'three@three.com' },
        ]
    );

    t.deepEqual(
        effects,
        []
    );
});
