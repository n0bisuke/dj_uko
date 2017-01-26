'use strict';

const express = require('express');
const router = express.Router();
const fs = require('fs');
const contentType = require('content-type')

const twUpload = require('../libs/tweet');
const linePublish = require('../modules/lineActions/publish');
const logging = require('../libs/logging');

const upload = require('multer')({dest:'./uploads/'}).single('thumbnail');

/* GET home page. */
router.get('/', (req, res, next) => {});

/* POST 画像アップロード */
router.post('/', (req, res, next) => {
    logging('\n\n\nぽすと');
    let buffers = [];
    let cnt = 0;
    req.on('data', (chunk) => {
        buffers.push(chunk);
        console.log(cnt++);
    });	
    req.on('end', () => {
        req.rawBody = Buffer.concat(buffers);
        console.log(req.rawBody);        
        fs.writeFile('./uploads/img.jpeg', req.rawBody, 'utf-8', function (err) {
            res.send('hey uko');
            up(req,res);
        });

    });
    // fs.writeFile('./hoge.jpeg', req.rawBody, 'utf-8', function (err) {
    // });


    // getRawBody(req, {
    //     length: req.headers['content-length'],
    //     limit: '1mb'
    // }, function (err, string) {
    //     console.log('lenght',req.headers['content-length']);
    //     console.log('encoding',contentType.parse(req).parameters.charset);
    //     if (err) return next(err);
    //     req.text = string
    //     console.log(req.text);
    //     fs.writeFile('./hoge.jpeg', req.text, 'utf-8', function (err) {
    //     });
    //     // next()
    // })
});

function up(req,res){
        upload(req, res, (err) => {
        if(err) {
            // console.log(err);
               logging(`${err}`);
            // res.send("Failed to write " + req.file.destination + " with " + err);
        } else {
            // console.log(req.file);
            // fs.rename(req.file.path, `./uploads/img.png`, (err) => {
            //     if(err){
            //         // fs.unlink(req.file.originalname);
            //         // fs.rename(req.file.filename, req.file.originalname);
            //     }
            //     logging(`file アップロード！`);
                
            twUpload((imageUrl)=>{
                console.log(imageUrl);
                logging(`Twitter アップロード！`);
                linePublish(`画像あっぷ！`, imageUrl);
            });

            //     // res.send(`uploaded${req.file.originalname} as ${req.file.filename}. Size ${req.file.size}`);
            // });
        }
    });
}

module.exports = router;
