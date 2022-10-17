const mongoose = require('mongoose');
const campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedsHelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
  useNewUrlParser: true,
  // useCreateIndex: true, 
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
  console.log('database connected');
})

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await campground.deleteMany({});
  for (i = 1; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new campground({
      author: '6346b805ab87d41ad9e4db26',
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      geometry : { 
        type: "Point", 
        coordinates : [ 36.6880794, -3.3696827 ] 
      },
      images: [
        {
          url: 'https://res.cloudinary.com/dd668jp9n/image/upload/v1665830287/YELPCAMP-UDEMY/v38wttjev00nzh65asi6.jpg',
          fileName: 'YELPCAMP-UDEMY/v38wttjev00nzh65asi6'
        },
        {
          url: 'https://res.cloudinary.com/dd668jp9n/image/upload/v1665830287/YELPCAMP-UDEMY/ahjxtuvvn0pmvu3zq4kh.jpg',
          fileName: 'YELPCAMP-UDEMY/ahjxtuvvn0pmvu3zq4kh'
        },
        {
          url: 'https://res.cloudinary.com/dd668jp9n/image/upload/v1665830287/YELPCAMP-UDEMY/hxnzruktttra8co1ywij.jpg',
          fileName: 'YELPCAMP-UDEMY/hxnzruktttra8co1ywij'
        }
      ],
      description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nemo iusto sequi ab! Neque vitae iure natus repellendus nam placeat quae, ullam veniam itaque, rem non, aliquid excepturi ipsa perspiciatis maiores!',
      price
    })
    await camp.save();
  }
}

seedDB().then(() => {
  mongoose.connection.close();
})