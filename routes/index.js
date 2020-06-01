const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

router.get('/', (req, res) => {
    res.render('landing');
});

router.get('/chat', ensureAuthenticated,(req, res) => {
    console.log(req.user.username);
    res.render('chat', {
        username: req.user.username
    });
});

module.exports = router;