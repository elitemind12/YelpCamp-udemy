const express = require('express');
const router = express.Router();
const catchAsync = require('../helpers/catchAsync');
const ExpressError = require('../helpers/ExpressError');
const Campground = require('../models/campground');
const Review = require('../models/review');
const { campgroundSchema, reviewSchema } = require('../schemas.js');
const Joi = require('joi');
const isLoggedIn = require('../middleware');

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}



router.get('/', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
})

router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
})

// app.post('/campgrounds', async (req, res, next) => {
//     try{
//     const campground = new Campground(req.body.campground);
//     await campground.save();
//     res.redirect(`/campgrounds/${campground._id}`);}
//     catch(e) {
//         next(e)
//     }
// })

router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
    // if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success', 'successfully made a new campground');
    res.redirect(`/campgrounds/${campground._id}`);

}))

router.get('/:id', isLoggedIn, async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    if (!campground) {
        req.flash('error', 'cannot find that campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
})

router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
}))



router.put('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'successfully updated a campground');
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'successfully deleted a campground');
    res.redirect('/campgrounds');
}))



module.exports = router;