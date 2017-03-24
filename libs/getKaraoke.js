'use strict'

const youtube = require('./youtube');
const co = require(`co`);
const fetch = require(`node-fetch`);
const ds = require('../modules/milkcocoaAction');
// const axios = require(`axios`);
// const fs = require(`fs`);
const TARGET_URL = 'http://www.karatetsu.com/ranking/index.php';
const OUTPUT_PATH = 'data/blog/karaoke.json';
const LIMIT = process.argv[2] || 10;

const getKaraoke = (body) => {
	let songList = body.split('<tr bgcolor=');
	songList.shift();

	let karaokeList = [];
	for(let i=0, len=LIMIT; i<len; i++){
		let name = songList[i].match(/siteid=com5">(.*?)<\/a><\/td>/)[1];
		let rank = songList[i].match(/<strong>(.*?)<\/strong>/)[1];
		let artist = songList[i].match(/<td>(.*?)<\/td>\n\s\s\s\s\s\s\s\s<td>\d{1,7}<\/td>/)[1];
		// karaokeList.push({name:name,rank:rank,artist:artist});
		karaokeList[i] = {name:name,rank:rank,artist:artist};
	}

	return new Promise((resolve, reject) => {
		if(karaokeList.length === 0){
			reject('要素がうまく朱徳できていません');
			return;
		}
		resolve(karaokeList);
	});
}

//youtube IDを取得
const getYtId = (name) => {
    return new Promise((resolve, reject) => {
        youtube(name, 1, (error, result)=>{
            if (error) reject(error);
            resolve(result.items[0].id.videoId);
        });
    });
}

co(function *(){
    let res = yield fetch(TARGET_URL);
	let body = yield res.text();
    let karaokeList = yield getKaraoke(body);
    let ytPlayList = [];
    for(let i =0, len=karaokeList.length; i<len; i++){
        ytPlayList[i] = yield getYtId(karaokeList[i].name);
        ds.send({videoId:ytPlayList[i]},(err,sended)=>{
            console.log(`追加`);
            return;
        });
    }
    console.log(ytPlayList); 
}).catch((err)=>console.log(err));