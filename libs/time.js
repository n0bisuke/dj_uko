'use strict';

module.exports = () => {
    let jikan= new Date();
    return `${jikan.getHours()}時${jikan.getMinutes()}分${jikan.getSeconds()}秒`;
}