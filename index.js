const express = require('express');
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
const routes = require('./routes/index');
const userRoutes = require('./routes/users');
require('dotenv/config');
const userModel = require('./models/users');
const roomModel = require('./models/rooms');
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use(
    session({
      secret: 'skippydiddydoop',
      resave: true,
      saveUninitialized: true
    })
);
app.use(flash());
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
  });
app.use('/', routes);
app.use('/users', userRoutes);

mongoose.connect(
    process.env.DB_CONNECT,
    { useNewUrlParser: true },
    () => console.log('Connected to MongoDB..')
)
.then()
.catch(err => {
    console.log(err);
});

const admin = "T-bot";

const port = 5000 || process.env.PORT;
const server = app.listen(port);
const io = socketIO(server);




//WS code...
io.on('connection', socket => {

    socket.on('roomList', ({ room }) => {
        socket.emit('roomList', roomList);
    });

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

