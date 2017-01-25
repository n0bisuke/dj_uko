'use strict'

const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
});

/* POST 画像アップロード */
router.post('/', (req, res, next) => {
    console.log(`aaaa`)
});

module.exports = router;
