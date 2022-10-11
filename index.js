const express = require('express');
const app = express();
const port = 8080;
const path = require('path');
const ExpressError = require('./helpers/ExpressError');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const campgroundRouters = require('./routes/campgrounds');
const reviewRouters = require('./routes/review');
const ejsMate = require('ejs-mate');



mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
    console.log('database connected');
})

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));




//routes middleware
app.use('/campgrounds', campgroundRouters);
app.use('/campgrounds/:id/reviews', reviewRouters);

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