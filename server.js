'use strict';

const PORT = process.env.PORT || 3000;

const express = require('express');
const bodyParser = require('body-parser');
const logging = require('./libs/logging');

const index = require('./routes/index');
const upload = require('./routes/fileupload');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', index);
app.use('/upload', upload);

app.listen(PORT);

logging(`起動! \n Server running at ${PORT} / Node.js v${process.versions.node}`);