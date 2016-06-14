'use strict';

const request = require('co-request');
const co = require('co');
const _ = require('lodash');

function urlify(passage) {
  return passage.replace(' ', '+');
}

function queryify(params) {
  return _(params)
    .keys()
    .map(k => k + '=' + params[k])
    .join('&')
    .valueOf();
}

function queryParams(passage, esvKey) {
  return {
    'include-headings': false,
    'include-verse-numbers': false,
    'include-footnotes': false,
    'include-footnote-links': false,
    key: esvKey,
    passage: urlify(passage)
  };
}

function fetchPassage(passage, key) {
  return co(function*() {
    const response = yield request('http://www.esvapi.org/v2/rest/passageQuery?'
                  + queryify(queryParams(passage, key)));
    return response.body;
  });
}

module.exports = {
  fetchPassage: fetchPassage
}
