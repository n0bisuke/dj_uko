'use strict';

const express = require('express');
const router = express.Router();

const lineAction = require('../modules/lineActions/main');
const logging = require('../libs/logging');
const ds = require('../modules/milkcocoaAction'); //Milkcocoa呼び出し

/* GET home page. */
router.get('/', (req, res, next) => {
    logging(`top page / GET`);
    res.sendfile('index.html');
});

/* POST LINE */
router.post('/', (req, res, next) => {
    logging(`top page / POST`);
    res.send(`top page / POST`);
    lineAction(req,res,next);
});

module.exports = router;
