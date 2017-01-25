'use strict';

const express = require('express');
const router = express.Router();

const httpRequest = require('../libs/httpRequest');
const ds = require('../modules/milkcocoaAction'); //Milkcocoa呼び出し

const logging = require('../libs/logging');

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
    logging(`こんにちは!!`);
    res.send(`こんにちは!!`);
});

/* POST LINE */
router.post('/', (req, res, next) => {
    // console.log(req.body);
    res.send('Hello World');

    let weo = req.body.events[0]; //weo -> WebhookEventObject    
    //メッセージが送られて来た場合
    if(weo.type === 'message'){
        let SendMessageObject;
        // console.log(weo);
        logging(weo.toString());
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
