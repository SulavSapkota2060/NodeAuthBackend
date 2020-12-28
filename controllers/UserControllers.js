const bcrypt = require("bcrypt");
const User = require("../models/UserModel");
const passport = require("passport");

const loginView = (req, res, next) => {
  res.render("login");
};
const registerView = (req, res, next) => {
  res.render("register");
};
const loginUser = (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/user/dashboard",
    failureRedirect: "/user/login",
    failureFlash: true,
  })(req, res, next);
};
const registerUser = async (req, res, next) => {
  const { fullName, emailAddress, password, re_password } = req.body;
  const errors = [];
  if (
    fullName == "" ||
    emailAddress == "" ||
    password == "" ||
    re_password == ""
  ) {
    errors.push("Please fill all the fields.");
  }
  if (password != re_password) {
    errors.push("Passwords don't match!");
  }
  const userExists = await User.find({ emailAddress: emailAddress });
  console.log("User", userExists);
  if (userExists != "") {
    errors.push("Email Address is already in use!");
  }
  if (errors.length == 0) {
    const hashedPass = await bcrypt.hash(password, 10);
    const user = new User({
      fullName: fullName,
      emailAddress: emailAddress,
      password: hashedPass,
    });
    user.save();
    req.flash("success_msg", "User Registered Successfully!");
    res.redirect("/user/login");
  } else {
    console.log(errors);
    res.render("register", { errors });
  }
};
const logout = (req, res, next) => {
  req.logout();
  req.flash("success_msg", "Logged Out!");
  res.redirect("/user/login");
};
const dashboard = (req, res, next) => {
  res.render("dashboard", { user: req.user });
};
const profile = (req, res, next) => {
  res.render("profile", { user: req.user });
};

const changePasswordView = (req, res, next) => {
  res.render("changePass");
};
const changePassword = (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const user = req.user;
  bcrypt.compare(oldPassword, user.password, (err, same) => {
    if (err) throw err;
    if (same) {
      bcrypt.hash(newPassword, 10, (err, hashPass) => {
        user.password = hashPass;
        user.save();
        req.logout();
      });
    } else {
      req.flash("error_msg", "Please check your password.");
      res.render("changePass")
    }
  });
};

module.exports = {
  changePassword,
  changePasswordView,
  profile,
  loginView,
  loginUser,
  registerView,
  registerUser,
  dashboard,
  logout,
};
