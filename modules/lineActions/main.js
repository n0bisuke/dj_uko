'use strict';

const logging = require('../../libs/logging');
const textMes = require('./reply_text');

module.exports = (req, res, next) =>{
    let weo = req.body.events[0]; //weo -> WebhookEventObject    
    logging(weo);
    //テキストメッセージが送られて来た場合
    if(weo.type === 'message'){
        textMes(weo);
    }else if(weo.type === 'follow'){

    }else if(weo.type === 'unfollow'){

    }else if(weo.type === 'join'){

    }else if(weo.type === 'leave'){

    }else if(weo.type === 'postback'){

    }else if(weo.type === 'beacon'){
        logging('----ble---!');
    }
}

