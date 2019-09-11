function buildSubject(upcoming) {
  return `Sermon for ${upcoming.date}: ${upcoming.title}`;
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

function footer(fromEmail) {
  return `
  Click here to <a href="mailto:${fromEmail}?subject=Unsubscribe">unsubscribe</a>, or
  share this <a href="mailto:${fromEmail}?subject=Subscribe">subscribe</a> link with a friend!
  `;
}

function buildBody({passageText, footer}) {
  return `<!DOCTYPE html>
<html>
  <head>
    <style>
      ${getCss()}
    </style>
  </head>
  <body>
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
    bodyHtml: buildBody({passageText, footer: footer(fromEmail)})
  };
}

module.exports = buildMessage;
