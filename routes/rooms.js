const express = require('express');
const router = express.Router();
const Room = require('../models/rooms');
const { ensureAuthenticated } = require('../config/auth');

router.post('/createroom', ensureAuthenticated, (req, res) => {
    let { roomname } = req.body;
    let errors = [];

    if(!roomname){
        errors.push({ msg: 'Please specify a room name' });
    }

    if(errors.length > 0) {
        res.render('dashboard', {
            errors,
            roomname
        });
    } else {
        Room.findOne({ roomname: roomname })
            .then(room => {
                if(room) {
                    errors.push({ msg: 'Room name already exists' });
                    res.render('dashboard', {
                        errors,
                        roomname
                    });
                } else {
                    const newRoom = new Room({
                        roomname
                    });
                    newRoom.save()
                        .then(room => {
                            req.flash(
                                'success_msg',
                                `Welcome to ${room.roomname}`
                                );
                            res.redirect(`/rooms/:${room.roomname}`);
                        })
                        .catch(err => {
                            console.log(err);
                        });
                }
            });
    }
});

router.get('/chatroom', ensureAuthenticated,(req, res) => {
    const { username } = req.user;

    res.render('chatroom', {
        username: username
    });
});

module.exports = router;