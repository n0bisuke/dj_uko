'use strict'

const MilkCocoa = require('milkcocoa');
const MC_ID = process.env.MC_ID || require(`../config`).MC_ID;
const milkcocoa = new MilkCocoa(`${MC_ID}.mlkcca.com`);
const ds = milkcocoa.dataStore('ytdata');

module.exports = ds;