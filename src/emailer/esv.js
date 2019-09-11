const url = require('url');
const got = require('got');

async function read(passage) {
    const passageUrl = url.format({
        protocol: 'http',
        hostname: 'www.esvapi.org',
        pathname: '/v2/rest/passageQuery',
        query: {
            'include-headings': false,
            'include-verse-numbers': false,
            'include-footnotes': false,
            'include-footnote-links': false,
            key: process.env.ESV_KEY,
            passage: passage.replace(' ', '+'),
        }
    });
    const response = await got(passageUrl);

    return response.body;
}

module.exports = {
  read: read
}
