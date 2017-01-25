'use strict';

const PORT = process.env.PORT || 3000;

const express = require('express');
const bodyParser = require('body-parser');

const index = require('./routes/index');
const upload = require('./routes/upload');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', index);
app.use('/upload', upload);

app.listen(PORT);
console.log(`Server running at ${PORT}`);