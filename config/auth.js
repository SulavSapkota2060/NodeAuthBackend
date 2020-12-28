const allow = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  }
  req.flash("error", "Please login to view Dashboard");
  res.redirect("/user/login");
};

module.exports = allow;
