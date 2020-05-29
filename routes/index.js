const express = require('express');
const router = express.Router();
const User = require('../models/users');
const path = require('path');

module.exports = app => {
    app.post('/signup', async (req, res) => {
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
    })

    app.get('/:userId', async (req, res) => {
        try{
            const existingUser = await User.findById(req.params.userId);
            res.json(existingUser);
        } catch(err) {
            res.json({ error: `current user error '${err}'` });
        }
    })
}