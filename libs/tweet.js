'use strict';

const path = require('path');
const Twitter = require('twitter');
const KEYS = {
    consumer_key: process.env.consumer_key || require('../config').twitter.consumer_key,
    consumer_secret: process.env.consumer_secret || require('../config').twitter.consumer_secret,
    access_token_key: process.env.access_token_key || require('../config').twitter.access_token_key,
    access_token_secret: process.env.access_token_secret || require('../config').twitter.access_token_secret,
};
const client = new Twitter(KEYS);
const getTime = require('./time');

let tweet = `私は今○○をしています。 ${getTime()}`;
// Make post request on media endpoint. Pass file data as media parameter

function twUpload(cb){
    
    let newPath = path.resolve(path.join(__dirname, '../uploads', 'img.jpeg'));
    let data = require('fs').readFileSync(newPath);

    client.post('media/upload', {media: data}, (error, media, media_res) => {
        if(error) return;

        let status = {
            status: tweet,
            media_ids: media.media_id_string // Pass the media id string
        }

        client.post('statuses/update', status, (error, tweet, response) => {
            if (error) {
                console.log(error);
                return;   
            }
            cb(tweet.extended_entities.media[0].media_url_https);
        });
    });
}

module.exports = twUpload;