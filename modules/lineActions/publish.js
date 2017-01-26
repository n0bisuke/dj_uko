'use strict'

const logging = require('../../libs/logging');
const httpRequest = require('../../libs/httpRequest');

module.exports = (mes, imageUrl) => {
    let SendMessageObject;
    if(imageUrl){
        SendMessageObject = [{
            type: 'template',
            altText: 'うこぴっぴ',
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

    httpRequest(`push`, SendMessageObject, {}, 'Ub159ea3fb8ede0b1b68f8270c16ae301')
    .then((body)=>{
        console.log(body);
    },(e)=>{
        console.log(e);
        ds.send({e});    
    });

}