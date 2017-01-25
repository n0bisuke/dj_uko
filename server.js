'use strict';

const MilkCocoa = require('milkcocoa');
const MC_ID = process.env.MC_ID || require(`./config`).MC_ID;
const milkcocoa = new MilkCocoa(`${MC_ID}.mlkcca.com`);
const ds = milkcocoa.dataStore('ytdata');

const express = require('express');
const http = require('http');
const fs = require('fs');
const formidable = require('formidable');
// const imageUpload = require('./libs/upload');
const httpRequest = require('./libs/httpRequest');

const PORT = process.env.PORT || 3000;

logging(`起動! \n認証情報: ${MC_ID}`);

// logging(`起動! \n認証情報: ${MC_ID} / ${CH_SECRET} / ${CH_ACCESS_TOKEN}`);


http.createServer((req, res) => {

    //ブラウザアクセス
    if(req.method === 'GET'){
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(`こんにちは`);
        return;
    }

    if(req.url !== '/'){
        console.log('こんばんわ');
        imageUpload(req,res);
        return;
    }

    // if(req.url === '/uploard' && req.method === 'POST'){
    //     console.log(req.url);
    //     imageUpload(req,res);
    //     return;
    // }

    let body = '';
    req.on('data', (chunk) => {
        body += chunk;
    });        
    req.on('end', () => {
        if(body === ''){
          console.log('bodyが空です。');
          return;
        }

        console.log(`aaa`);
        let weo = JSON.parse(body).events[0]; //weo -> WebhookEventObject   
        //メッセージが送られて来た場合
        if(weo.type === 'message'){
            let SendMessageObject;
            console.log(weo);
            if(weo.message.type === 'text'){
                if(weo.message.text === 'debug:reload'){
                    ds.send({videoId:'リロード'},(err,sended)=>{
                        console.log(`リロード!!`);
                        return;
                    });
                }else if(weo.message.text === 'スキップ'){
                    ds.send({videoId:'スキップ'},(err,sended)=>{
                        console.log(`スキップ!!`);
                        return;
                    });
                    SendMessageObject = [{
                        type: 'text',
                        text: `スキップします`
                    }];
                }else{
                    if(getIdByUrl(weo.message.text)){
                        SendMessageObject = [{
                            type: 'text',
                            text: weo.message.text+` を追加したよ！`
                        }];
                    }else{
                        SendMessageObject = [];
                    }
                }
            }
            httpRequest(weo.replyToken, SendMessageObject)
            .then((body)=>{
                console.log(body);
            },(e)=>{
                console.log(e);
                ds.send({e});
            });
        }

        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('su');
    });

}).listen(PORT);

console.log(`Server running at ${PORT}`);

//https://www.youtube.com/watch?v=EeRwJsjyoZs -> EeRwJsjyoZs
function getIdByUrl(url){
    let re = /youtube\.com\/watch\?v=(.*)/i;
    if(url.match(re)){
        let videoId = url.match(re)[1];
        console.log('IDげと',videoId);
        ds.send({videoId:videoId},(err,sended)=>{
            console.log(err,sended);
        });
        return true;
    }else{
        console.log('してない');
        return false;
    }
}

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

/**
 * ロギング
 */
function logging(log){
    if(PORT === 3000){
        console.log(log);
    }else{
        ds.send({mes:log});
    }
}