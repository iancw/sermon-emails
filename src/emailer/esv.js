const got = require('got');

async function read(passage) {
    const passageUrl = new URL('https://api.esv.org/v3/passage/html/')
    passageUrl.searchParams.append('q', passage);
    passageUrl.searchParams.append('include-passage-references', true);
    passageUrl.searchParams.append('include-verse-numbers', false);
    passageUrl.searchParams.append('include-first-verse-numbers', false);
    passageUrl.searchParams.append('include-footnotes', false);
    passageUrl.searchParams.append('include-short-copyright', true);
    passageUrl.searchParams.append('inline-styles', true);
    passageUrl.searchParams.append('include-audio-link', false);
    passageUrl.searchParams.append('include-headings', false);
    passageUrl.searchParams.append('include-subheadings', false);

    const response = await got(passageUrl, {headers: {
        'Authorization': `Token ${process.env.ESV_KEY}`
    }});

    return JSON.parse(response.body).passages[0];
}

module.exports = {
  read: read
}
