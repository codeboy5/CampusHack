const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const router = express.Router();

require('../models/users');
const User = mongoose.model('User');

router.get('/login',(req,res,next)=>{
    res.render('auth/login');
});

router.get('/register',(req,res,next)=>{
    res.render('auth/register');
});

router.post('/register',(req,res,next)=>{
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        username: req.body.username,
        name: req.body.name
    }

    bcrypt.hash(newUser.password,12)
    .then(isHashed => {
        newUser.password = isHashed;
        return new User(newUser).save()
    })
    .then(()=>{
        console.log('User Was Registered');
        res.send('User Was Registered');
    })
    .catch(err => {
        console.log(err);
    });
});

router.post('/login',(req,res,next)=>{
    const username= req.body.username;
    const password = req.body.password;

    User.findOne({
        username: username
    })
    .then(user => {
        if(!user) {
            console.log('User Not Found');
            res.send('No Such User Exists');
        }
        bcrypt.compare(password,user.password)
        .then(isMatch => {
            if(!isMatch) {
                console.log('Password Does Not Match');
                res.send('Password Does Not Match');
            }
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
                console.log(err);
                res.redirect('/');
            });
        })
        .catch(err => {
            console.log(err);
        });
    })
    .catch(err => {
        console.log(err);
    });
});

module.exports = router;