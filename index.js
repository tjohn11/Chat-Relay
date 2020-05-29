const express = require('express');
const path = require('path');
const socketIO = require('socket.io');
const format = require('./utils/messages');
const {
    getCurrentUser,
    currentRoomUsers,
    joinRoom,
    leaveRoom
} = require('./utils/users');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv/config');
const userModel = require('./models/users');
const roomModel = require('./models/rooms');

const app = express();
app.use(bodyParser.json());
// const routes = require('./routes/index')(app);
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
    socket.on('joinRoom', ({ username, room }) => {
        const newUser = joinRoom(socket.id, username, room);


        socket.joinRoom(newUser.room);

        socket.emit('message', format(admin, 'Welcome to the chat'));

        socket.broadcast
            .to(newUser.room)
            .emit('message', format(admin, `${newUser.username} has joined the chat`));

        io.to(newUser.room).emit('roomUsers', {
            room: newUser.room,
            users: currentRoomUsers(newUser.room)
        });
    });

    socket.on('disconnect', () => {
        const disconnectingUser = leaveRoom(socket.id);

        if (disconnectingUser) {
            io.to(disconnectingUser.room).emit('roomUsers', {
                room: disconnectingUser.room,
                users: currentRoomUsers(disconnectingUser.room)
            });
            io.emit(
                'message',
                format(admin, `${disconnectingUser.username} has left the chat`)
            );
        }
    });

    socket.on('chat message', msg => {
        const currentUser = getCurrentUser(socket.id);
        io.to(currentUser.room).emit('message', format(currentUser.username, msg));
    });
});

