'use strict'

const logging = require('../../libs/logging');
const httpRequest = require('../../libs/httpRequest');

module.exports = () => {
    
    let SendMessageObject = [{
        type: 'text',
        text: `スキップされました。`
    }];
    httpRequest(`/v2/bot/message/push`,weo.replyToken, SendMessageObject)
    .then((body)=>{
        console.log(body);
    },(e)=>{
        console.log(e);
        ds.send({e});    
    });

}