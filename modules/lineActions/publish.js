'use strict'

const logging = require('../../libs/logging');
const httpRequest = require('../../libs/httpRequest');
const ds = require('../../modules/milkcocoaAction'); //Milkcocoa呼び出し

let userList = []; //ユーザーリスト

// ds.on('send',(sended,err)=>{
//     if(!sended.value.userId)return;
//     userList.push(sended.value.userId);
//     console.log('---userList',userList);
// });

module.exports = (mes, imageUrl) => {
    let SendMessageObject;
    if(imageUrl){
        SendMessageObject = [{
            type: 'template',
            altText: 'お使いの端末でご覧いただけません。',
            template: {
                type: 'buttons',
                thumbnailImageUrl: imageUrl,
                title: '浮気現場激写',
                text: '彼氏がSKYNの箱を開けたようです。ツイートして制裁しますか？',
                actions: [{
                    type: 'postback',
                    label: 'はい',
                    data: 'youtubeの何か',
                    text: 'URL'
                },{
                    type: 'postback',
                    label: 'いいえ',
                    data: 'youtubeの何か',
                    text: 'URL'
                }]
            }
        }];
    }
    
    // else if(){
    //     //画像送信
    //     SendMessageObject = [{
    //         type: 'image',
    //         originalContentUrl: imageUrl,
    //         previewImageUrl: imageUrl
    //     }];
    // }
    
    else{
        //テキスト送信
        SendMessageObject = [{
            type: 'text',
            text: mes
        }];
    }

    // userList = function(userList) {
    //     return userList.reduce(function(a, b) {
    //         if (a.indexOf(b) === -1) {
    //             a.push(b);
    //         }
    //         return a;
    //     }, []);
    // };
    // console.log(`----`,userList);

    // for(let i = 0, len = userList.length; i<len; i++){
        httpRequest(`push`, SendMessageObject, {}, 'Ra91092a5ce60ad62ac408a148c99c9dc')
        .then((body)=>{
            console.log(body);
        },(e)=>{
            console.log(e);
            ds.send({e});    
        });
    // }
}