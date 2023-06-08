const mongoose = require("mongoose");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");
const Campground = require("../models/campground");

/*
        "/"    means the root of the current drive;
        "./"    means the current directory;
        "../"   means the parent of the current directory.
*/

mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];
const price = [99, 199, 299, 399, 499];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 10; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const camp = new Campground({
      author: "643babb8072a6ce142fba7d5",
      title: `${sample(descriptors)} ${sample(places)}`,
      price: `${price[Math.floor(Math.random() * 4)]}`,
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      images: [
        {
          url: "https://res.cloudinary.com/daiparzzb/image/upload/v1681873611/YelpCamp/rbrdcrilix8fwabkw5pc.jpg",
          filename: "YelpCamp/rbrdcrilix8fwabkw5pc",
        },
        {
          url: "https://res.cloudinary.com/daiparzzb/image/upload/v1681873615/YelpCamp/sn3fbclrjfwtdlw1bwaw.jpg",
          filename: "YelpCamp/sn3fbclrjfwtdlw1bwaw",
        },
      ],
      description:
        "If you love nature and adventure, you will love our campground! We have spacious sites for tents and RVs, with fire pits and picnic tables. You can enjoy hiking, fishing, kayaking, or just relaxing in the fresh air. Our campground also has a playground, a store, and a laundry facility for your convenience. Come and experience the beauty and fun of camping with us!",
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
