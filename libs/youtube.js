'use strict';

const YouTube = require('youtube-node');
const youTube = new YouTube();
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || require('../config').GOOGLE_API_KEY;
youTube.setKey(GOOGLE_API_KEY);
module.exports = youTube.search;

    // (key,limit=5) => {
    // let columns = [];
    // console.log(GOOGLE_API_KEY);
