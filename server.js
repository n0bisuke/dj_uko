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

// const http = require('http');
// const fs = require('fs');
// const formidable = require('formidable');
// const imageUpload = require('./libs/upload');

/**
 * 画像アップロード処理
 */
function imageUpload(req,res){
    console.log("Request handler 'show' was called.");
    var form = new formidable.IncomingForm();
    console.log("about parse");
    form.parse(req, function(error, fields, files){
        console.log("parsing done");
        console.log(fields, files);
        fs.rename(files.path, "./test.png", function(err){
            if(err){
                fs.unlink("./test.png");
                fs.rename(files.upload.path, "./test.png");
            }
        });
       res.writeHead(200, {"Content-Type":"text/html; charset=UTF-8"});
       res.write("送信された画像ですよー↓<br/>");
       res.write("<img src='/show' />");
       res.end();
    });

    return;
}