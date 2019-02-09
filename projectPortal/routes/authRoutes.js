const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const router = express.Router();

require('../models/users');
const User = mongoose.model('User');

router.post('/register',(req,res,next)=>{
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        username: req.body.username,
        name: req.body.name
    }

    new User(newUser)
    .save()
    .then(()=>{
        console.log('User Was Registered');
        res.send('User Was Registered');
    })
    .catch(err => {
        console.log(err);
    });
});

module.exports = router;