'use strict'

const express = require('express');
const router = express.Router();

var multer = require('multer');
var upload = multer({ dest: './uploads/' }).single('thumbnail');


/* GET home page. */
router.get('/', (req, res, next) => {
});

/* POST 画像アップロード */
router.post('/', (req, res, next) => {
    upload(req, res, (err) => {
        if(err) {
            console.log(err);
            // res.send("Failed to write " + req.file.destination + " with " + err);
        } else {
            console.log(req.file);
            res.send(`uploaded${req.file.originalname} as ${req.file.filename}. Size ${req.file.size}`);
        }
    });
});

module.exports = router;
