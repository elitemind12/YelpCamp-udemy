const mongoose = require('mongoose');
const campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedsHelpers');
const db = require('./db');
db.connect();

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await campground.deleteMany({});
  for (i = 1; i < 300; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new campground({
      author: '6346b805ab87d41ad9e4db26',
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      geometry : { 
        type: "Point", 
        coordinates : [ 
          cities[random1000].longitude,
          cities[random1000].latitude
         ] 
      },
      images: [
        {
          url: 'https://res.cloudinary.com/dd668jp9n/image/upload/v1666075984/YELPCAMP-UDEMY/xnf6sbolgjbndcoqbgov.jpg',
          fileName: 'YELPCAMP-UDEMY/p0scigley17wgc1b95m0'
        },
        {
          url: 'https://res.cloudinary.com/dd668jp9n/image/upload/v1666075984/YELPCAMP-UDEMY/xnf6sbolgjbndcoqbgov.jpg',
          fileName: 'YELPCAMP-UDEMY/p0scigley17wgc1b95m0'
        },
        {
          url: 'https://res.cloudinary.com/dd668jp9n/image/upload/v1666075984/YELPCAMP-UDEMY/xnf6sbolgjbndcoqbgov.jpg',
          fileName: 'YELPCAMP-UDEMY/p0scigley17wgc1b95m0'
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