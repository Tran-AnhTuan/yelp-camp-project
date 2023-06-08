const passport = require("passport");
const User = require("../models/user");

module.exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email });

    //passport-local-mongoose .register()
    const registeredUser = await User.register(newUser, password);

    //chỗ này chưa authenticated nên phải tự gọi login
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to Yelpcamp");
      res.redirect("/campgrounds");
    });
  } catch (e) {
    //register() có lỗi thì vào đây
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

module.exports.renderRegisterForm = (req, res) => {
  res.render("users/register");
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login");
};

module.exports.loginConfirm = (req, res) => {
  req.flash("success", `Welcome back!`);
  const redirectUrl = res.locals.returnTo || "/campgrounds";
  delete res.locals.returnTo;
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye!");
    res.redirect("/campgrounds");
  });
};
