const ava = require('ava');

const { isSubscribing, isUnsubscribing, createActions } = require('./actions');

ava('isSubscribing', (t) => {
    t.is(true, isSubscribing({ses: {mail: {commonHeaders: {subject: 'subscribe'}}}}));
    t.is(true, isSubscribing({ses: {mail: {commonHeaders: {subject: 'SUBSCRIBE'}}}}));

    t.is(false, isSubscribing({ses: {mail: {commonHeaders: {subject: 'unsubscribe'}}}}));
    t.is(false, isSubscribing({ses: {mail: {commonHeaders: {subject: '' }}}}));
    t.is(false, isSubscribing({}));
    t.is(false, isSubscribing({ses: {mail: {commonHeaders: {subject: 'sbuscribe'}}} }));
});

ava('isUnsubscribing', (t) => {
    t.is(true, isUnsubscribing({ses: {mail: {commonHeaders: {subject: 'unsubscribe'}}}}));
    t.is(true, isUnsubscribing({ses: {mail: {commonHeaders: {subject: 'UNSUBSCRIBE'}}}}));

    t.is(false, isUnsubscribing({ses: {mail: {commonHeaders: {subject: 'subscribe'}}}}));
    t.is(false, isUnsubscribing({ses: {mail: {commonHeaders: {subject: 'Subscribe'}}}}));
    t.is(false, isUnsubscribing({ses: {mail: {commonHeaders: {subject: 'SUBSCRIbE'}}}}));
    t.is(false, isUnsubscribing({ses: {mail: {commonHeaders: {subject: '' }}}}));
    t.is(false, isUnsubscribing({}));
    t.is(false, isUnsubscribing({ses: {mail: {commonHeaders: {subject: 'sbuscribe'}}} }));
});

ava('createActions', (t) => {
    t.deepEqual(createActions(
        {
            ses: {
                mail: {
                    commonHeaders: {
                        subject: 'Subscribe',
                        from: [
                            'Name Schmame <name.schmame@mailer.net>'
                        ]
                    }
                }
            }
        }),
        {
            action: 'ADD',
            recipient: {
                dateAdded: new Date().toISOString().slice(0, 10),
                name: 'Name Schmame',
                email: 'name.schmame@mailer.net'
            }
        }
    );

    t.deepEqual(createActions(
        {
            ses: {
                mail: {
                    commonHeaders: {
                        subject: 'Unsubscribe',
                        from: [
                            'Name Schmame <name.schmame@mailer.net>'
                        ]
                    }
                }
            }
        }),
        {
            action: 'REMOVE',
            recipient: {
                name: 'Name Schmame',
                email: 'name.schmame@mailer.net'
            }
        }
    );

    t.deepEqual(createActions(
        {
            ses: {
                mail: {
                    commonHeaders: {
                        subject: 'Will you be my friend?',
                        from: [
                            'Name Schmame <name.schmame@mailer.net>'
                        ]
                    }
                }
            }
        }),
        {
            action: 'SKIP',
        }
    );

    t.deepEqual(createActions(
        {
            ses: {
                mail: {
                    commonHeaders: {
                        subject: 'Subscribe'
                    }
                }
            }
        }),
        {action: 'ERROR', info: {message: 'No email address found'}}
    );

    t.deepEqual(
        createActions({
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
        }),
        {action: 'REMOVE', recipient: {name: 'Name Schmame', email: 'one@one.com'}}
    );

    t.deepEqual(
        createActions({}),
        {action: 'SKIP'}
    );
});
