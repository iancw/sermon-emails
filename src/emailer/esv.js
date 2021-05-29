const got = require('got');

async function read(passage) {
    const passageUrl = new URL('https://api.esv.org/v3/passage/text/')
    passageUrl.searchParams.append('q', passage);
    passageUrl.searchParams.append('include-passage-references', false);
    passageUrl.searchParams.append('include-verse-numbers', false);
    passageUrl.searchParams.append('include-first-verse-numbers', false);
    passageUrl.searchParams.append('include-footnotes', false);

    const response = await got(passageUrl, {headers: {
        'Authorization': `Token ${process.env.ESV_KEY}`
    }});

    return JSON.parse(response.body).passages[0];
}

module.exports = {
  read: read
}
