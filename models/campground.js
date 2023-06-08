const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  url: String,
  filename: String,
  //_id: { _id: false },
});

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200,h_120");
});

const CampgroundSchema = new Schema({
  title: String,
  images: [ImageSchema],
  price: Number,
  description: String,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

//run after findByIdAndDelete
CampgroundSchema.post("findOneAndDelete", async function (camp) {
  if (camp) {
    await Review.deleteMany({
      _id: {
        $in: camp.reviews,
      },
    });
  }
});

module.exports = mongoose.model("Campground", CampgroundSchema);
