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

let newPath = path.resolve(path.join(__dirname, '../uploads', 'img.png'));
let data = require('fs').readFileSync(newPath);
// Make post request on media endpoint. Pass file data as media parameter

function twUpload(cb){
    client.post('media/upload', {media: data}, (error, media, media_res) => {
        if (!error) {
            // If successful, a media object will be returned.
            // console.log(media);
            // Lets tweet it
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
        }
    });
}

module.exports = twUpload;