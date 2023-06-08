const campground = require("../models/campground");
const Campground = require("../models/campground");
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

module.exports.newForm = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.createCampground = async (req, res, next) => {
  const campground = new Campground(req.body.campground);
  campground.images = req.files.map((file) => ({
    url: file.path,
    filename: file.filename,
  }));
  campground.author = req.user._id;
  await campground.save();
  req.flash("success", "Successfully made a new campground!");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampground = async (req, res) => {
  const foundedCampground = await Campground.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: { path: "author" },
    })
    .populate("author");
  if (!foundedCampground) {
    req.flash("error", "Cannot find that campground");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/detail", { camp: foundedCampground });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const camp = await Campground.findById(id);
  if (!camp) {
    req.flash("error", "Cannot find that campground");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { camp });
};

module.exports.updateCampground = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "You don't have permission to edit this campground");
    return res.redirect(`/campgrounds/${id}`);
  }
  const newImages = req.files.map(({ path, filename }) => ({ url: path, filename }));
  const editedCampground = await Campground.findByIdAndUpdate(id, { ...req.body.campground, $push: { images: { $each: newImages } } }, { runValidators: true, new: true });
  if (req.body.deleteImages) {
    req.body.deleteImages.forEach((filename) => {
      cloudinary.uploader.destroy(filename);
    });
    await editedCampground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
  }
  req.flash("success", "Campground updated successfully!");
  res.redirect(`/campgrounds/${editedCampground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  const deletedCamp = await Campground.findByIdAndDelete(id);
  req.flash("success", `Deleted ${deletedCamp.title} Successfully!`);
  res.redirect("/campgrounds");
};
