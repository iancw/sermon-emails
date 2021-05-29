const findUpcoming = require('./find-upcoming');
const buildMessage = require('./build-message');

async function buildEmail({upcoming, config, atDate, esv}) {
  console.log(`Buliding email for current date ${atDate}...`);
  const nextSermon = findUpcoming(
    atDate,
    upcoming,
  );
  console.log(`Found next sermon: ${JSON.stringify(nextSermon)}`);

  const passageText = await esv.read(nextSermon.passage);

  const content = buildMessage({
    upcoming: nextSermon,
    passageText,
    fromEmail: config.fromEmail
  });
  const paramTemplate = {
    from: `${config.fromName} <${config.fromEmail}>`,
    subject: content.subject,
    bodyHtml: content.bodyHtml
  };
  return paramTemplate;
}

module.exports = buildEmail;
