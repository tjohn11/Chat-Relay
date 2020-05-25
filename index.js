const path = require('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const formatMessage = require('./utils/messages');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const admin = "T-bot";

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', socket => {
    console.log('new ws connection');
    socket.emit('message', formatMessage(admin, 'Welcome to the chat'));

    socket.broadcast.emit('message', formatMessage(admin, 'A user has joined the chat'));

    socket.on('disconnect', () => {
        io.emit('message', formatMessage(admin, 'A user has left the chat'));
    });

    socket.on('chat message', msg => {
        io.emit('message', formatMessage('USER', msg));
    });
});

const port = 5000 || process.env.PORT;

server.listen(port);