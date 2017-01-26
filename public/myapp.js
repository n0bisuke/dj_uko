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
var videoList = ['PDSkFeMVNFs','ZFoJYI7Q4iA']; 
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
        }
    });
}

function onPlayerReady(event) {
    player.setLoop(true);
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

    else {
        if(sended.value.videoId){
            console.log(sended.value.videoId);
            videoList.push(sended.value.videoId);
        }
    }
    console.log(videoList);
});