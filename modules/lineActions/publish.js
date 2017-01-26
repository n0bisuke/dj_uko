'use strict'

const logging = require('../../libs/logging');
const httpRequest = require('../../libs/httpRequest');
const ds = require('../../modules/milkcocoaAction'); //Milkcocoa呼び出し

let userList = []; //ユーザーリスト

var unique = function(array) {
    return array.reduce(function(a, b) {
        if (a.indexOf(b) === -1) {
            a.push(b);
        }
        return a;
    }, []);
};

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
                text: 'ここはどこでしょうか',
                actions: [{
                    type: 'postback',
                    label: '新宿',
                    data: 'youtubeの何か',
                    text: 'URL'
                },{
                    type: 'postback',
                    label: 'ニューヨーク',
                    data: 'youtubeの何か',
                    text: 'URL'
                },{
                    type: 'postback',
                    label: '深セン',
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
        httpRequest(`push`, SendMessageObject, {}, 'U56c54d4060eeb9881b18e5523fcec7b3')
        .then((body)=>{
            console.log(body);
        },(e)=>{
            console.log(e);
            ds.send({e});    
        });
    // }
}