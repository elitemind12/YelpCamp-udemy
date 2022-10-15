const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../helpers/catchAsync');
const reviews = require('../controllers/reviews')
const isLoggedIn = require('../middlewares/authentication');
const { validateReview } = require('../middlewares/validation');
const { isAuthorReview } = require('../middlewares/authorazition');


router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

router.delete('/:reviewId', isLoggedIn, isAuthorReview, catchAsync(reviews.deleteReview))

module.exports = router;