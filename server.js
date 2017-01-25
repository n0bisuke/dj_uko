'use strict';

const MilkCocoa = require('milkcocoa');
const MC_ID = process.env.MC_ID || require(`./config`).MC_ID;

const milkcocoa = new MilkCocoa(`${MC_ID}.mlkcca.com`);
const ds = milkcocoa.dataStore('ytdata');

const http = require('http');
const https = require('https');
const crypto = require('crypto');
const imageUpload = require('./libs/upload');

const HOST = 'api.line.me'; 
const REPLY_PATH = '/v2/bot/message/reply';//リプライ用
const CH_SECRET = process.env.CH_SECRET || require(`./config`).CH_SECRET; //Channel Secretを指定
const CH_ACCESS_TOKEN = process.env.CH_ACCESS_TOKEN || require(`./config`).CH_ACCESS_TOKEN; //Channel Access Tokenを指定
const SIGNATURE = crypto.createHmac('sha256', CH_SECRET);
const PORT = process.env.PORT || 3000;

logging(`起動! \n認証情報: ${MC_ID} / ${CH_SECRET} / ${CH_ACCESS_TOKEN}`);

/**
 * httpリクエスト部分
 */
const client = (replyToken, SendMessageObject) => {    
    let postDataStr = JSON.stringify({ replyToken: replyToken, messages: SendMessageObject });
    let options = {
        host: HOST,
        port: 443,
        path: REPLY_PATH,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'X-Line-Signature': SIGNATURE,
            'Authorization': `Bearer ${CH_ACCESS_TOKEN}`,
            'Content-Length': Buffer.byteLength(postDataStr)
        }
    };

    return new Promise((resolve, reject) => {
        let req = https.request(options, (res) => {
                    let body = '';
                    res.setEncoding('utf8');
                    res.on('data', (chunk) => {
                        body += chunk;
                    });
                    res.on('end', () => {
                        resolve(body);
                    });
        });

        req.on('error', (e) => {
            reject(e);
        });
        req.write(postDataStr);
        req.end();
    });
};

http.createServer((req, res) => {    
    if(req.url !== '/' || req.method !== 'POST'){
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(`こんにちは`);
    }

    if(req.url !== '/uploard' || req.method !== 'POST'){
        imageUpload(req,res);
    }

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
        let WebhookEventObject = JSON.parse(body).events[0];        
        //メッセージが送られて来た場合
        if(WebhookEventObject.type === 'message'){
            let SendMessageObject;
            console.log(WebhookEventObject);
            if(WebhookEventObject.message.type === 'text'){
                if(WebhookEventObject.message.text === 'debug:reload'){
                    ds.send({videoId:'リロード'},(err,sended)=>{
                        console.log(`リロード!!`);
                        return;
                    });
                }else if(WebhookEventObject.message.text === 'スキップ'){
                    ds.send({videoId:'スキップ'},(err,sended)=>{
                        console.log(`スキップ!!`);
                        return;
                    });
                    SendMessageObject = [{
                        type: 'text',
                        text: `スキップします`
                    }];
                }else{
                    if(getIdByUrl(WebhookEventObject.message.text)){
                        SendMessageObject = [{
                            type: 'text',
                            text: WebhookEventObject.message.text+` を追加したよ！`
                        }];
                    }else{
                        SendMessageObject = [];
                    }
                }
            }
            client(WebhookEventObject.replyToken, SendMessageObject)
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

function logging(log){
    if(PORT === 3000){
        console.log(log);
    }else{
        ds.send(log);
    }
}