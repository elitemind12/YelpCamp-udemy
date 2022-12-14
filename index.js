if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}


const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const path = require('path');
const ExpressError = require('./helpers/ExpressError');
const db = require("./db");
db.connect();
const methodOverride = require('method-override');
const campgroundRouters = require('./routes/campgrounds');
const reviewRouters = require('./routes/review');
const userRoutes = require('./routes/users');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const dotenv = require('dotenv');

dotenv.config();
// require("./globalConfig")(passport);
const passportLocal = require('passport-local');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');
const MongoStore = require('connect-mongo');
const jwt = require("jsonwebtoken");
// const dbUrl = process.env.DB_URL;
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';



app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());

const sessionConfig = {
     store: MongoStore.create({
        mongoUrl: dbUrl,
        touchAfter: 24 * 60 * 60
      }),
    name: 'makyao',
    secret: process.env.SECRET || 'confidential',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

//routes middleware
app.use('/campgrounds', campgroundRouters);
app.use('/campgrounds/:id/reviews', reviewRouters);
app.use('/', userRoutes);

app.get('/', (req, res) => {
    res.render('home');
})

app.all('*', (req, res, next) => {
    next(new ExpressError('page not found', 404));
})



app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'something went wrong';
    res.status(statusCode).render('layouts/error', { err });
})


app.listen(port, () => {
    console.log('on port 8080');
})