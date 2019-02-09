const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');


const keys = require('./config/keys');

const projectPortalRoutes = require('./routes/projectPortalRoutes');
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/authRoutes');

require('./models/users');
const User = mongoose.model('User');

const app = express();

app.use(bodyParser.urlencoded({extended:'true'}));

// app.post('/auth/register',(req,res,next)=>{
//     const newUser = {
//         email: req.body.email,
//         password: req.body.password,
//         username: req.body.username,
//         name: req.body.name
//     }

//     new User(newUser)
//     .save()
//     .then(()=>{
//         console.log('User Was Registered');
//         res.send('User Was Registered');
//     })
//     .catch(err => {
//         console.log(err);
//     });
// });
app.use('/auth',authRoutes);
app.use('/projectportal',projectPortalRoutes);

mongoose.connect(keys.mongoUrl)
.then(res =>{
    console.log('Connected To Mongoose');
    const port = process.env.PORT || 3000;
    app.listen(3000,()=>{
        console.log(`Server Started On Port ${port}`);
    });
});