const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const bcrypt    = require('bcryptjs');


const app = express();

//passport config
require('./config/passport')(passport);

//db config
const User = require('./models/User');
const Course = require('./models/Courses');

// DB config
const db = require('./config/keys').MongoURI;

//Connnect to Mongo
mongoose.connect(db, { useNewUrlParser: true })
    .then(() => console.log("mongoDB connected..."))
    .catch(err => console.log(err));

//EJS
app.set('view engine', 'ejs');

//BodyParser
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

//express-session middleware
app.use(session({
    secret: 'internship',
    resave: false,
    saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());

//global vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/users/login");
}

//routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/course', require('./routes/course'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`The server is running on port ${PORT}`);
});
