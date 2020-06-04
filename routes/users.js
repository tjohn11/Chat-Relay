const express = require('express');
const router = express.Router();
const User = require('../models/users');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { ensureAuthenticated } = require('../config/auth');

router.get('/signup', (req, res) => res.render('signup'));

router.get('/login', (req, res) => res.render('login'));

router.post('/signup', (req, res) => {
    let { username, password, passwordConfirm } = req.body;
    let errors = [];

    if(!username || !password || !passwordConfirm)
        errors.push({ msg: 'Please complete in all fields' });
    if(password !== passwordConfirm)
        errors.push({ msg: 'Passwords must match' });

    if(errors.length > 0) {
       res.render('signup', {
        errors,
        username,
        password,
        passwordConfirm  
    });
    } else {
        User.findOne({ username: username })
            .then(user => {
                if(user) {
                    errors.push({ msg: 'Username exists' });
                    res.render('signup', {
                        errors,
                        username,
                        password,
                        passwordConfirm  
                    });
                } else {
                    const newUser = new User({
                        username,
                        password
                    });
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if(err) throw err;
                            newUser.password = hash;
                            newUser.save()
                                .then(user => {
                                    req.flash(
                                        'success_msg',
                                        'Sign up successful! You can now login'
                                        );
                                    res.redirect('/users/login');
                                })
                                .catch(err => {
                                    console.log(err);
                                });
                        })
                    })
                }
            });
    }
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'Logout Successful');
    res.redirect('/users/login');
});

module.exports = router;