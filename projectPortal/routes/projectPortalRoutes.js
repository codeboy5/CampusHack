const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

require('../models/projects');
const Project = mongoose.model('Project');

router.get('/',(req,res,next)=>{
    res.render('projectportal/index')
});

router.get('/addproject',(req,res,next)=>{
    res.render('projectportal/addproject');
});

router.post('/addproject',(req,res,next)=>{
    const newProject = {
        name: req.body.name,
        description: req.body.description
    };
    new Project(newProject)
    .save()
    .then((result) => {
        console.log('Project Added to the database');
        res.send('Project Added to the database');
    }).catch((err) => {
        console.log(err);
    });
});

module.exports = router;