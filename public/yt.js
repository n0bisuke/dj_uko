'use strict';

/***
 *古いスマホでの動作を予定。 ES2015的な書き方は一部しかできないかも
 */

//Milkcocoa
var milkcocoa = new MilkCocoa('woodilrg1cz3.mlkcca.com');
var ds = milkcocoa.dataStore('ytdata');

// IFrame Player API の読み込み
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
var videoList = ['oCrwzN6eb4Q','PCp2iXA1uLE']; 
var videoIndex = 0;
var error_count = 0; //不正なIDが来て読み込めない場合
var passEvent;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('myplayer', {
        width: '320',
        height: '240',
        videoId: videoList[videoIndex],
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        },
    });
}

function onPlayerReady(event) {
    player.setLoop(true);
    player.setVolume(50); //音量を半分にしてスタート
    event.target.playVideo();
}

function onPlayerStateChange(event) {
    console.log(event.data,YT.PlayerState);
    if (event.data === YT.PlayerState.ENDED) {
        nextPlay(event);
    }

    if(event.data === YT.PlayerState.UNSTARTED){
        startTimer(event);
    }else{
        stopTimer();
    }

    passEvent = event;
}

function nextPlay(event){
    videoIndex++;
    videoIndex = videoIndex % videoList.length;
    event.target.loadVideoById(videoList[videoIndex]);
}

function prevPlay(event){
    videoIndex = videoIndex - 1;
    videoIndex = videoIndex % videoList.length;
    event.target.loadVideoById(videoList[videoIndex]);
}

function shufflePlay(event){
    var rand = Math.floor( Math.random() * videoList.length);
    videoIndex = videoIndex % videoList.length;
    event.target.loadVideoById(videoList[rand]);
}



var errorTimer;
function startTimer(event){
    errorTimer = setInterval(function(){
        error_count++;

        //読み込みできずに10秒たった場合
        console.log(error_count);
        if(error_count > 5){
            nextPlay(event);
        }
    } , 1000);
}

//エラー初期化
function stopTimer(){
    error_count = 0;
    clearInterval(errorTimer);
}

//音量をあげる
function vlumeUp(){
    var vol = player.getVolume();
    vol += 10;
    player.setVolume(vol);
}

//音量を下げる
function vlumeDown(){
    var vol = player.getVolume();
    vol -= 10;
    player.setVolume(vol);
}

//再生速度アップ
function speedUp(){
    var speed = player.getPlaybackRate();
    speed += 0.5;
    player.setPlaybackRate(speed);
}

//再生速度ダウン
function speedDown(){
    var speed = player.getPlaybackRate();
    speed -= 0.5;
    player.setPlaybackRate(speed);
}

//リスト更新
ds.on('send',function(sended,err){
    if(sended.value.videoId === 'リロード'){
        location.reload();
        return;
    }

    else if(sended.value.videoId === 'スキップ'){
        nextPlay(passEvent);
        console.log('[スキップ]');
        return;
    }

    else if(sended.value.videoId === '前に'){
        prevPlay(passEvent);
        console.log('[前に]');
        return;
    }

    else if(sended.value.videoId === 'シャッフル'){
        shufflePlay(passEvent);
        console.log('[シャッフル]');
        return;
    }

    else if(sended.value.videoId === '+'){
        vlumeUp();
        console.log('[ボリュームUP]');
        return;
    }

    else if(sended.value.videoId === '-'){
        vlumeDown();
        console.log('[ボリュームDown]');
        return;
    }

    else if(sended.value.videoId === '↑'){
        speedUp();
        console.log('[スピードUP]');
        return;
    }

    else if(sended.value.videoId === '↓'){
        speedDown();
        console.log('[スピードDown]');
        return;
    }

    else {
        if(sended.value.videoId){
            console.log(sended.value.videoId);
            videoList.push(sended.value.videoId);
        }
    }
    console.log(videoList);
});