const path = require('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);


app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', socket => {
    console.log('new ws connection');
    socket.emit('message', 'Welcome to chat');

    socket.broadcast.emit('message', 'A user has joined the chat');

    socket.on('disconnect', () => {
        io.emit('message', 'a user has left the chat');
    });

    socket.on('chat message', msg => {
        io.emit('message', msg);
    });
});

const port = 5000 || process.env.PORT;

server.listen(port);