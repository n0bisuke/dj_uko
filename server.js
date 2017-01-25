'use strict';

const MilkCocoa = require('milkcocoa');
const milkcocoa = new MilkCocoa(`${process.env.MC_ID}.mlkcca.com`);
const ds = milkcocoa.dataStore('ytdata');
ds.send({mes:'起動!'});

const http = require('http');
const https = require('https');
const crypto = require('crypto');

const HOST = 'api.line.me'; 
const REPLY_PATH = '/v2/bot/message/reply';//リプライ用
const CH_SECRET = process.env.CH_SECRET; //Channel Secretを指定
const CH_ACCESS_TOKEN = process.env.CH_ACCESS_TOKEN; //Channel Access Tokenを指定
const SIGNATURE = crypto.createHmac('sha256', CH_SECRET);
const PORT = process.env.PORT || 3000;

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
                }
                if(getIdByUrl(WebhookEventObject.message.text)){
                    SendMessageObject = [{
                        type: 'text',
                        text: WebhookEventObject.message.text+` を追加したよ！`
                    }];
                }else{
                    SendMessageObject = [{
                        type: 'text',
                        text: `IDを見つけられませんよ`
                    }];
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
    if(url.match(/youtube\.com\/watch\?v=(.*)/i)){
        let videoId = url.match(/www\.youtube\.com\/watch\?v=(.*)/i)[1];
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
