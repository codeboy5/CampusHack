const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const router = express.Router();

const keys = require('../config/keys');

require('../models/projects');
const Project = mongoose.model('Project');

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
    Project.find({}, ['name', 'description'])
        .sort([
            ['createdAt', -1]
        ])
        .exec((err, projects) => {
            if (err) {
                console.log(err);
            }
            res.render('projectportal/index', {
                projects: projects
            });
        });
});

router.get('/addproject', (req, res, next) => {
    res.render('projectportal/addproject');
});

router.get('/interested/:id', (req, res, next) => {
    Project.findById(req.params.id)
        .then(p => {
            return p.addPeopleInterested(req.user._id)
        })
        .then(result => {
            res.redirect('/projectportal');
        })
        .catch(err => {
            console.log(err);
        });
});

router.post('/addproject', (req, res, next) => {
    const newProject = {
        name: req.body.name,
        description: req.body.description,
        department: req.body.department,
        projectBy: req.body.projectBy,
        author: req.user._id
    };
    new Project(newProject)
        .save()
        .then((result) => {
            console.log('Project Added to the database');
            res.redirect('/projectportal')
        }).catch((err) => {
            console.log(err);
        });
});

router.get('/myprojects', (req, res, next) => {
    Project.find({
            author: req.user._id
        })
        .then(projects => {
            res.render('projectportal/myprojects', {
                projects: projects
            });
        })
        .catch(err => {
            console.log(err);
        });
});

router.get('/projectsInterested', (req, res, next) => {
    Project.find({
            peopleInterested: req.user._id
        })
        .then(projects => {
            res.render('projectportal/myprojects', {
                projects: projects
            });
        })
        .catch(err => {
            console.log(err);
        });
});

router.get('/project/:id', (req, res, next) => {
    Project.findById(req.params.id)
        .then(project => {
            res.render('projectportal/project', {
                project: project
            });
        })
        .catch(err => {
            console.log(err);
        });
});

router.get('/approve/:user_id/:project_id', (req, res, next) => {

    const user_id = req.params.user_id;
    const project_id = req.params.project_id;

    User.findById(user_id)
    .then(user => {
        return transporter.sendMail({
            from: 'sakshamdev5@gmail.com',
            to: user.email,
            subject: 'Your Application Was Approved',
            html: `
                <p> Hey Your Request Was Approved </p>
                <p> Thank You </p>
            `
        });
    })
    .then(result => {
        res.redirect('/projectportal/myprojects');
    })
    .catch(err => {
        console.log(err);
    });
});

router.get('/peopleinterested/:id', (req, res, next) => {
    Project.findById(req.params.id)
        .populate('peopleInterested')
        .exec((err, result) => {
            // console.log(result);
            res.render('projectportal/peopleInterested', {
                project: result
            });
        });
});



// router.post('/filter',(req,res,next)=>{
//     console.log(req.body.department)
//     Project.find({
//         department: req.body.department
//     })
//     .then(projects => {
//         res.send(projects);
//     })
//     .catch(err => {
//         console.log(err);
//     });
// });

module.exports = router;