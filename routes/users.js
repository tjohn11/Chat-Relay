const express = require('express');
const router = express.Router();
const User = require('../models/users');
const path = require('path');

router.get('/signup', (req, res) => res.render('signup'));

router.get('/login', (req, res) => res.render('login'));

router.post('user/signup', async (req, res) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    })

    try {
        const newUser = await user.save();
        res.json(newUser);
    } catch (err) {
        res.json({ error: `new user error '${err}'` });
    }
});

router.get('/:userId', async (req, res) => {
    try{
        const existingUser = await User.findById(req.params.userId);
        res.json(existingUser);
    } catch(err) {
        res.json({ error: `current user error '${err}'` });
    }
});

module.exports = router;