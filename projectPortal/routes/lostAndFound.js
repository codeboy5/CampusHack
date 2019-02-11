const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const router = express.Router();

const keys = require('../config/keys');

require('../models/items');
const Item = mongoose.model('Item');

require('../models/users');
const User = mongoose.model('User');

const transporter = nodemailer.createTransport(
    sendgridTransport({
        auth: {
            api_key: keys.SendgridApiKey
        }
    })
);

router.get('/', (req, res, next) => {
    // const location = [];
    Item.find()
        .then(items => {
            // for(let item of items){
            //     location.push(item.location)
            // }
            // console.log(location);
            res.render('lostandfound/homepage', {
                items: items
            });
        })
        .catch(err => {
            console.log(err);
        });
});

router.get('/item/:id', (req, res, next) => {
    Item.findById(req.params.id)
        .populate('owner')
        .exec((err, item) => {
            res.render('lostandfound/item', {
                location: item.location,
                item: item
            });
        })
    // .then(item => {
    //     res.render('lostandfound/item',{location:item.location,item:item});
    // })
    // .catch(err => {
    //     console.log(err);
    // });
});

router.get('/additem', (req, res, next) => {
    res.render('lostandfound/additem')
});

router.post('/additem', (req, res, next) => {

    const newItem = {
        name: req.body.name,
        description: req.body.description,
        location: req.body.location,
        lastSeen: req.body.lastseen,
        owner: req.user._id
    }

    new Item(newItem)
        .save()
        .then(result => {
            console.log(result);
            res.redirect('/lostandfound');
        })
        .catch(err => {
            console.log(err);
        });
});

router.get('/found/:id', (req, res, next) => {
    User.findById(req.params.id)
    .then(user => {
        return transporter.sendMail({
            from: 'sakshamdev5@gmail.com',
            to: user.email,
            subject: 'Your Item Was Found',
            html: `
                <p> Hey The Item You Lost Was Found </p>
            `
        })
    })
    .then(result => {
        res.redirect('/lostandfound');
    })
    .catch(err => {
        console.log(err);
    });
});

module.exports = router;
