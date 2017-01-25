'use strict'

const express = require('express');
const router = express.Router();
const fs = require('fs');
const tw = require('../libs/tweet');

const upload = require('multer')({dest:'./uploads/'}).single('thumbnail');

/* GET home page. */
router.get('/', (req, res, next) => {});

/* POST 画像アップロード */
router.post('/', (req, res, next) => {
    upload(req, res, (err) => {
        if(err) {
            console.log(err);
            // res.send("Failed to write " + req.file.destination + " with " + err);
        } else {
            console.log(req.file);

            fs.rename(req.file.path, `./uploads/img.png`, (err) => {
                if(err){
                    // fs.unlink(req.file.originalname);
                    // fs.rename(req.file.filename, req.file.originalname);
                }
                tw();
                // res.send(`uploaded${req.file.originalname} as ${req.file.filename}. Size ${req.file.size}`);
            });
        }
    });
});

module.exports = router;
