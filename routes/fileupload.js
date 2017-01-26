'use strict';

const express = require('express');
const router = express.Router();
const fs = require('fs');
const contentType = require('content-type')

const twUpload = require('../libs/tweet');
const linePublish = require('../modules/lineActions/publish');
const logging = require('../libs/logging');

/* GET home page. */
router.get('/', (req, res, next) => {});

/* POST 画像アップロード */
router.post('/', (req, res, next) => {
    logging('\n\n\nぽすと');
    let buffers = [];
    let cnt = 0;
    req.on('data', (chunk) => {
        buffers.push(chunk);
        // console.log(cnt++);
        logging(cnt++);
    });	

    req.on('end', () => {
        req.rawBody = Buffer.concat(buffers);
        console.log(req.rawBody);        
        fs.writeFile('./uploads/img.jpeg', req.rawBody, 'utf-8', function (err) {
            res.send('hey uko');
            // up(req,res);
            twUpload((imageUrl)=>{
                console.log(imageUrl);
                logging(`Twitter アップロード！`);
                linePublish(`画像あっぷ！`, imageUrl);
            });
        });
    });
});

module.exports = router;
