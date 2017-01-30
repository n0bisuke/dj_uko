'use strict';

const YouTube = require('youtube-node');
const youTube = new YouTube();
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || require('../config').GOOGLE_API_KEY;
youTube.setKey(GOOGLE_API_KEY);

youTube.getById('Lzrh_NOX2-s', function(error, result) {
  if (error) {
    console.log(error);
  }
  else {
    console.log(JSON.stringify(result, null, 2));
  }
});

module.exports = youTube.search;

    // (key,limit=5) => {
    // let columns = [];
    // console.log(GOOGLE_API_KEY);
