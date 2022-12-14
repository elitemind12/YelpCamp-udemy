const express = require('express');
const router = express.Router();
const catchAsync = require('../helpers/catchAsync');
const campgrounds = require('../controllers/campgrounds');
const { validateCampground } = require('../middlewares/validation');
const isLoggedIn = require('../middlewares/authentication');
const {isAuthor } = require('../middlewares/authorazition');
const multer  = require('multer');
const { storage } = require('../cloudinary/index')
const upload = multer({ storage })


router.route('/')
.get(catchAsync(campgrounds.index))
.post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.create))



router.get('/new', isLoggedIn, catchAsync(campgrounds.new));


router.route('/:id').get(isLoggedIn, catchAsync(campgrounds.show))
  .put(isLoggedIn, isAuthor, upload.array('image'), catchAsync(campgrounds.update))
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.delete))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.edit))


module.exports = router;