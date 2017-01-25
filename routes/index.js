'use strict'

const PORT = process.env.PORT || 3000;

const express = require('express');
const router = express.Router();

const MilkCocoa = require('milkcocoa');
const MC_ID = process.env.MC_ID || require(`../config`).MC_ID;
const milkcocoa = new MilkCocoa(`${MC_ID}.mlkcca.com`);
const ds = milkcocoa.dataStore('ytdata');

const httpRequest = require('../libs/httpRequest');

logging(`起動! \n認証情報: ${MC_ID}`);
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

/* GET home page. */
router.get('/', (req, res, next) => {
    logging(`こんにちは`);
    res.send('top Page');
});

/* POST LINE */
router.post('/', (req, res, next) => {
    console.log(req.body);
    res.send('Hello World');

    let weo = req.body.events[0]; //weo -> WebhookEventObject    
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
});

module.exports = router;
