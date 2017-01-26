'use strict';

const getTime = require('./time');
const PORT = process.env.PORT || 3000;

const ds = require('../modules/milkcocoaAction'); //Milkcocoa呼び出し

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
        ds.send({debug:result,time:getTime()});
    }
}