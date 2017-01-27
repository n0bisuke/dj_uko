'use strict'

/**
 * https://www.youtube.com/watch?v=EeRwJsjyoZs -> EeRwJsjyoZs
 * https://youtu.be/LsVtsAr6prA -> LsVtsAr6prA
 * IDを取得する
 */
module.exports = (url) => {
    let re = /youtube\.com\/watch\?v=(.*)/i;
    if(url.match(re)){
        let videoId = url.match(re)[1];
        console.log('IDげっと',videoId);
        return videoId;
    }
    
    else if(url.match(/youtu\.be\/(.*)/i)){
        let videoId = url.match(/youtu\.be\/(.*)/i)[1];
        console.log('IDげっと',videoId);
        return videoId;
    }
    
    else{
        console.log('ID発見できず');
        return false;
    }    
}