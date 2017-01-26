'use strict';

const logging = require('../../libs/logging');
const httpRequest = require('../../libs/httpRequest');
const getIdByUrl = require('../../libs/getIdByUrl');
const ds = require('../../modules/milkcocoaAction'); //Milkcocoa呼び出し

module.exports = (weo) => {
    let SendMessageObject;
    
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
        let videoId = getIdByUrl(weo.message.text);
        if(videoId){
            SendMessageObject = [{
                type: 'text',
                text: weo.message.text+` を追加したよ！`
            }];
            ds.send({videoId:videoId},(err,sended)=>{
                console.log(err,sended);
            });
        }else{
            SendMessageObject = [];
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