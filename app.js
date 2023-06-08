process.env.NODE_ENV !== "production" && require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const engine = require("ejs-mate");
const methodOverride = require("method-override");
const morgan = require("morgan");
const mongoSanitize = require("express-mongo-sanitize");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

//Routes
const campground = require("./routes/campgrounds");
const review = require("./routes/reviews");
const usersRoutes = require("./routes/users");

//Model
const User = require("./models/user");

//Chạy index, kết nối Mongo
require("./models");

const app = express();

//views configuration
app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//Middleware
app.use(mongoSanitize());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(morgan("tiny"));

//sau này phải có store ở db?
const sessionConfig = {
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //1 weeks in milliseconds
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  },
};
app.use(session(sessionConfig));
app.use(flash());

//Đặt sau session
app.use(passport.initialize());
app.use(passport.session());

//User.[method] là của local-mongoose
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//flash kiểu như cái map ấy!!
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

//Routes
app.use("/", usersRoutes);
app.use("/campgrounds", campground);
app.use("/campgrounds/:id/reviews", review);

//Default Route
app.get("/", (req, res) => {
  res.render("home");
});

//404
app.all("*", (req, res, next) => {
  res.status(404).render("404");
  //next(new ExpressError("Page not found", 404));
});

//Error handling
app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong" } = err;
  res.status(status).render("error", { err, message });
});

app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`);
});
