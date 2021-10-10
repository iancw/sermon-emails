const ses = require('../ses');
const {isAdd, isRemove} = require('./actions');
const {buildAndSend} = require('../emailer');


function getCss() {
  return `
    html {
      color: #555;
    }
  `;
}

const welcomeBody = ({fromEmail}) => `
<!DOCTYPE html>
<html>
  <head>
    <style>
      ${getCss()}
    </style>
  </head>
  <body>
    <div class="welcome">
    <p>
    Welcome to daily sermon emails! You are subscribed to receive an email
    with the passage for the upcoming sermon at Capitol Hill Baptist Church.
    </p>

    <p>
    You can unsubscribe any time by sending an email to
    <a href="mailto:${fromEmail}?subject=unsubscribe">${fromEmail}</a>
    with a subject line "unsubscribe."

    You can invite others by having them send an email to
    <a href="mailto:${fromEmail}?subject=subscribe">${fromEmail}</a>
    with a subject line "subscribe."
    </p>

    <p>
    I hope these emails help you regularly meditate on God's word and grow in knowledge
    and love of our great savior.
    </p>
    </div>
  </body>
</html>
`;

const farewellBody = ({fromEmail}) => `
<!DOCTYPE html>
<html>
  <head>
    <style>
      ${getCss()}
    </style>
  </head>
  <body>
    <div class="farewell">
    <p>
    We have removed you from the daily emails per your request.
    <p>

    <p>
    You can re-subscribe at any time by sending an email to
    <a href="mailto:${fromEmail}?subject=subscribe">${fromEmail}</a>
    with a subject line "subscribe."
    </p>
    </div>
  </body>
</html>
`;

const welcome = async ({fromEmail, name, email}) => {
    await ses.send({
        to: `${name} <${email}>`,
        from: fromEmail,
        subject: 'Welcome to daily sermon emails!',
        bodyHtml: welcomeBody({fromEmail})
    })
    await buildAndSend([{name, email}]);
};

const farewell = async ({fromEmail, name, email}) => {
    await ses.send({
        to: `${name} <${email}>`,
        from: fromEmail,
        subject: 'Farewell from daily sermon emails',
        bodyHtml: farewellBody({fromEmail})
    })
};

const notify = (fromEmail) => async ({action, recipient}) => {
    if (isAdd({action})) {
        await welcome({fromEmail, ...recipient});
        console.log(`Welcomed ${recipient.name}`)
        return `Welcomed ${recipient.name}`;
    }
    if (isRemove({action})) {
        await farewell({fromEmail, ...recipient});
        console.log(`Bade farewell to ${recipient.name}`)
        return `Bade farewell to ${recipient.name}`;
    }
    return 'Did nothing';
}

module.exports = {
    notify,
    welcome,
    farewell,
};
