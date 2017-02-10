'use strict'



// const http = require('http').Server(app);
// const io = require('socket.io')(http); //socket.io読み込み

// const http = require('http');
// const io = require('socket.io')(http); //socket.io読み込み
// const io = require('socket.io')();
// io.sockets.emit('an event sent to all connected clients');
// io.emit('an event sent to all connected clients');
// const app = require('../server');
// const http = require('http').Server(app);
// const io = require('socket.io')(http); //socket.io読み込み
module.exports = (app) => {
    const http = require('http').Server(app);
    const io = require('socket.io')(http); //socket.io読み込み
    console.log(io);
    return io;
};