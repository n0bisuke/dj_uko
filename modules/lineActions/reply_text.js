'use strict';

const logging = require('../../libs/logging');
const youtube = require('../../libs/youtube');
const httpRequest = require('../../libs/httpRequest');
const getIdByUrl = require('../../libs/getIdByUrl');
const ds = require('../../modules/milkcocoaAction'); //Milkcocoa呼び出し

module.exports = (weo) => {
    let SendMessageObject;
    ds.send({videoId:'',userId:weo.source.userId}); //userIDを貯める
    
    if(weo.message.text === 'debug:reload'){
        ds.send({videoId:'リロード'},(err,sended)=>{
            console.log(`リロード!!`);
            return;
        });    
    }

    else if(weo.message.text === '大'){
        ds.send({videoId:'大'},(err,sended)=>{
            console.log(`大`);
            return;
        });
        SendMessageObject = [{
            type: 'text',
            text: `スキップします`
        }];
    }
    
    else if(weo.message.text === 'スキップ' || weo.message.text === '現在の曲をスキップします。'){
        ds.send({videoId:'スキップ'},(err,sended)=>{
            console.log(`スキップ!!`);
            return;
        });
        SendMessageObject = [{
            type: 'text',
            text: `スキップします`
        }];
    }

    else if(weo.message.text === 'シャッフルします。'){
        ds.send({videoId:'シャッフル'},(err,sended)=>{
            console.log(`シャッフル!!`);
            return;
        });
        SendMessageObject = [{
            type: 'text',
            text: `シャッフルします。`
        }];
    }

    else if(weo.message.text === `一つ前の曲に戻ります。`){
        ds.send({videoId:'前に'},(err,sended)=>{
            console.log(`前に!`);
            return;
        });

        SendMessageObject = [{
            type: 'text',
            text: `一つ前に戻ります。`
        }];
    }

    else if(weo.message.text.match(/(.*)を検索/i)){
        let keyword = weo.message.text.match(/(.*)を検索/i)[1];
        console.log(keyword);
        youtube(keyword, 5, (error, result) => {
            if(error){
                console.log('エラー?',error);
            }
            else {
                let columns = [];
                for(let item of result.items){
                    columns.push({
                        thumbnailImageUrl: item.snippet.thumbnails.medium.url,
                        title: item.snippet.title.substring(0,40),
                        text: item.snippet.description.substring(0,60),
                        actions: [{
                            type: 'postback',
                            label: 'この曲を再生する',
                            data: item.id.videoId,
                            text: `${item.snippet.title}をリストに追加します。`
                        }]
                    });
                }
                console.log(columns);

                SendMessageObject = [{
                    type: 'template',
                    altText: 'お使いの端末でご覧いただけません。',
                    template: {
                        type: 'carousel',
                        columns: columns
                    }
                }];
                // cb(columns);
                //console.log(columns);
            }
        });
    }

    else if(weo.message.text === 'リモコン'){
        SendMessageObject = [{
            type: 'template',
            altText: 'お使いの端末でご覧いただけません。',
            template: {
                type: 'buttons',
                thumbnailImageUrl: 'https://dotstud.io/img/members/ukkz/author.png',
                title: '楽曲操作ができます。',
                text: 'どうする？',
                actions: [{
                    type: 'postback',
                    label: '[>]スキップ',
                    data: 'youtubeの何か',
                    text: '現在の曲をスキップします。'
                },{
                    type: 'postback',
                    label: '[<<]一個前へもどる',
                    data: 'youtubeの何か',
                    text: '一つ前の曲に戻ります。'
                },{
                    type: 'postback',
                    label: '[*]シャッフル',
                    data: 'youtubeの何か',
                    text: 'シャッフルします。'
                },{
                    type: 'postback',
                    label: '[=]夢を叶える',
                    data: 'youtubeの何か',
                    text: 'ざんねん。未実装です。実装してください。https://github.com/n0bisuke/dj_uko'
                }]
            }
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
    
    setTimeout(()=>{
        console.log(`どうだい:`,SendMessageObject);
        httpRequest(`reply`, SendMessageObject, weo.replyToken)
        .then((body)=>{
            console.log(body);
        },(e)=>{
            console.log(e);
            ds.send({e});
        });

    },5000);
}