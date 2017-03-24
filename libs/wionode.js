'use strict'

const axios = require('axios');
const co = require('co');

const TOKEN = require('../config').WIONODE.TOKEN;
const BASE_URL = 'https://us.wio.seeed.io/v1/node';
let flag = 1;

//リレーで照明
const relay = (flag) => {
    return axios.request({
        method: 'post',
        baseURL: BASE_URL,
        url: `/GroveRelayD0/onoff/${flag}?access_token=${TOKEN}`
    })
}

//リレーの状態
//https://us.wio.seeed.io/v1/node/GroveRelayD0/onoff_status?access_token=a8ed23a0ed42f8fcad57702726e0fc26
const getRelay = () => {
    return axios.request({
        method: 'get',
        baseURL: BASE_URL,
        url: `/GroveRelayD0/onoff_status?access_token=${TOKEN}`
    })
}

//照明取得
// const getLight = () => {
//     return axios.request({
//         method: 'get',
//         baseURL: BASE_URL,
//         url: `/GenericAInA0/analog?access_token=${TOKEN}`
//     })
// }

// const main = () => {
//     co(function *(){
//         let flag = 0;
//         let res = yield getLight();
//         console.log(`照度: ${res.data.analog}`);
//         if(res.data.analog < 50) {
//             flag = 1;
//             res = yield relay(flag);
//             console.log(res.data);
//         }
//     }).catch((err)=>{
//         console.log(err);
//     });
// }

// main();
module.exports = {relay:relay, getRelay:getRelay}
// module.exports = {relay:relay}