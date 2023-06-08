const express = require("express");
const router = express.Router();
const campground = require("../controllers/campgrounds");
//Utils
const catchAsync = require("../utils/catchAsync");
//Middlewares
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");

//Images Upload
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router
    .route("/")
    .get(catchAsync(campground.index))
    .post(isLoggedIn, upload.array("images"), validateCampground, catchAsync(campground.createCampground));

router.get("/new", isLoggedIn, campground.newForm);
router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campground.renderEditForm));

router
    .route("/:id")
    .get(catchAsync(campground.showCampground))
    .delete(isAuthor, catchAsync(campground.deleteCampground))
    .put(isLoggedIn, isAuthor, upload.array("images"), validateCampground, catchAsync(campground.updateCampground));

module.exports = router;
