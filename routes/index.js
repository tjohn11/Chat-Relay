const express = require('express');
const router = express.Router();
const Room = require('../models/rooms');
const { ensureAuthenticated } = require('../config/auth');

router.get('/', (req, res) => {
    res.render('landing');
});

router.get('/dashboard', ensureAuthenticated,(req, res) => {
    const { username } = req.user
    Room.find({})
        .then(roomList => {
            res.render('dashboard', {
                username: username,
                roomList: roomList
            });
        })
        .catch(err => console.log(err));
});

module.exports = router;