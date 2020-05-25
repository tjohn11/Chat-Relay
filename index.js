const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const formatMessage = require('./utils/messages');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv/config');
const user = require('./models/users');

const app = express();
app.use(bodyParser.json());
const routes = require('./routes/index')(app);
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(
    process.env.DB_CONNECT,
    { useNewUrlParser: true },
    () => console.log('connected to db')
);

const admin = "T-bot";

const port = 5000 || process.env.PORT;
const server = app.listen(port);
const io = socketIO(server);

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

