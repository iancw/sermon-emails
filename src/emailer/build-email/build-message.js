function buildSubject(upcoming) {
  return `Sermon for ${upcoming.date.toLocaleDateString('en-US', {month: 'long', day: 'numeric', timeZone: 'UTC'})}: ${upcoming.passage} ${upcoming.title}`;
}

function getCss() {
  return `
    html {
      color: #555;
    }

    .esv-text {
      font-size: 20px;
    }

    .chapter-num {
      font-size: 40px;
    }

    h2 {
      font-size: 40px;
    }

    .footer {
      font-size: 10px;
      padding: 10px;
      color: #777;
    }
  `;
}

const copyright = `Scripture quotations are from the ESV® Bible (The Holy Bible, English Standard Version®), copyright © 2001 by Crossway, a publishing ministry of Good News Publishers. Used by permission. All rights reserved.`;

function footer(fromEmail) {
  return `
  <p class="copyright">${copyright}</p>
  <p class="subscription">
  Click here to <a href="mailto:${fromEmail}?subject=Unsubscribe">unsubscribe</a>, or
  share this <a href="mailto:${fromEmail}?subject=Subscribe">subscribe</a> link with a friend!
  </p>
  `;
}

function buildBody({passageText, preacher, title, reference, footer}) {
  return `<!DOCTYPE html>
<html>
  <head>
    <style>
      ${getCss()}
    </style>
  </head>
  <body>
    <h2>${title} ${preacher ? `(${preacher})` : ''}</h2>
    <div class="passage">
    ${passageText}
    </div>
    <div class="footer">${footer}</div>
  </body>
</html>`;
}

function buildMessage({upcoming, passageText, fromEmail}) {
  return {
    subject: buildSubject(upcoming),
    bodyHtml: buildBody({passageText, preacher: upcoming.preacher, title: upcoming.title, footer: footer(fromEmail)})
  };
}

module.exports = buildMessage;
