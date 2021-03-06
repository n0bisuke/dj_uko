'use strict';

/**
 * httpリクエスト部分
 */

const https = require('https');
const crypto = require('crypto');
const HOST = 'api.line.me';
// const REPLY_PATH = ' ';//リプライ用
const CH_SECRET = process.env.CH_SECRET || require(`../config`).CH_SECRET; //Channel Secretを指定
const CH_ACCESS_TOKEN = process.env.CH_ACCESS_TOKEN || require(`../config`).CH_ACCESS_TOKEN; //Channel Access Tokenを指定
const SIGNATURE = crypto.createHmac('sha256', CH_SECRET);

module.exports = (type,SendMessageObject,replyToken='',to='') => {
    let apiPath = '';
    let postDataStr = '';

    if(type === 'push'){
        apiPath = '/v2/bot/message/push';
        postDataStr = JSON.stringify({ to: to, messages: SendMessageObject });
    }else if(type === 'reply'){
        apiPath = '/v2/bot/message/reply';
        postDataStr = JSON.stringify({ replyToken: replyToken, messages: SendMessageObject });
    }

    let options = {
        host: HOST,
        port: 443,
        path: apiPath,
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