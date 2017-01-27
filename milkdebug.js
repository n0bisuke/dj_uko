'use strict';

const MC_ID = process.env.MC_ID || require(`./config`).MC_ID;
const MilkCocoa = require('milkcocoa');
const milkcocoa = new MilkCocoa(`${MC_ID}.mlkcca.com`);
const ds = milkcocoa.dataStore('ytdata');
ds.on('send',function(send,err){console.log(send,err)});
ds.send({mes:'デバッガスタート'});
