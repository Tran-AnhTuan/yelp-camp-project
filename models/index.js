const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("error", console.error.bind(console, "connection error"));
mongoose.connection.once("open", () => {
  console.log("Database connected");
});
