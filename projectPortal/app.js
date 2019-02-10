const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const path = require('path');


const keys = require('./config/keys');

const projectPortalRoutes = require('./routes/projectPortalRoutes');
const lostAndFoundRoutes = require('./routes/lostAndFound');
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/authRoutes');

const isAuth = require('./helpers/isAuth');

require('./models/users');
const User = mongoose.model('User');

const app = express();
const store = new MongoDBStore({
    uri: keys.mongoUrl,
    collection: 'sessions'
});

app.use(bodyParser.urlencoded({extended:'true'}));
// app.use(express.static(__dirname,'public'));
app.use(express.static(path.join(__dirname,'public')));
app.use(session({
    store: store,
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

app.use((req,res,next)=>{
    if(!req.session.user){
        return next();
    }
    User.findById(req.session.user._id)
    .then(user => {
        req.user = user;
        next();
    })
    .catch(err => {
        console.log(err);
    });
});

app.use((req,res,next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    next();
});

app.set('view engine','ejs');
app.set('views','views');

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
app.get('/',(req,res,next)=>{
    const user = {}
    if(req.session.isLoggedIn){
        User.findById(req.user._id)
        .then(u => {
           res.render('index',{user:u})
        })
        .catch(err => {
            console.log(err);
        });
    } else {
        res.render('index',{user:''});
    }
});
app.use('/auth',authRoutes);
app.use('/projectportal',isAuth,projectPortalRoutes);
app.use('/lostandfound',isAuth,lostAndFoundRoutes)

mongoose.connect(keys.mongoUrl)
.then(res =>{
    console.log('Connected To Mongoose');
    const port = process.env.PORT || 3000;
    app.listen(3000,()=>{
        console.log(`Server Started On Port ${port}`);
    });
});