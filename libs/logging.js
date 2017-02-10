'use strict';

const getTime = require('./time');
const PORT = process.env.PORT || 3000;

const ds = require('../modules/milkcocoaAction'); //Milkcocoa呼び出し
// const io = require('../server'); //socket.io呼び出し

module.exports = (log) => {
    if(PORT === 3000){
        console.log(log);
        console.log(getTime());
    }else{
        let result;
        if(typeof(log) == 'object'){
            result = JSON.stringify(log);
        }else{
            result = log;
        }
        // io.emit('debug',{debug:result,time:getTime()});
        ds.send({debug:result,time:getTime()});
    }
}