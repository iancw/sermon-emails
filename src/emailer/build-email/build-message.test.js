const ava = require('ava');
const buildMessage = require('./build-message');

ava('test build-message', function (t) {
  const message = buildMessage({
    upcoming: {
      date: 'January 3',
      passage: 'Luke 18:9-30',
      title: 'Sermon Title'
    },
    passageText: 'Some biblical text',
    fromEmail: 'from@fromy.from'
  });

  t.deepEqual(message.subject, 'Sermon for January 3: Sermon Title');
  t.is(
    message.bodyHtml.includes('Some biblical text'),
    true,
    `Message body should contain text, but was '${message.body}'`
  );
  t.is(
   message.bodyHtml.includes('Some biblical text'),
    true,
    `Message body should contain text, but was '${message.body}'`
  );
  t.is(
    message.bodyHtml.includes('mailto:from@fromy.from?subject=Unsubscribe'),
    true
  );

  t.is(
    message.bodyHtml.includes('mailto:from@fromy.from?subject=Subscribe'),
    true
  );
});
