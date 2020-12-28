const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/UserModel");
const bcrypt = require("bcrypt");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
      },
      (email, password, done) => {
        User.findOne({ emailAddress: email }, (err, user) => {
          if (err) {
            console.log("ERRRRRORRRRRR:M");
          }
          if (!user) {
            return done(null, false, { message: "Email not registered!" });
          }
          bcrypt.compare(password, user.password, (err, result) => {
            if (err) throw err;
            if (result) {
              return done(null, user);
            } else {
              return done(null, false, { message: "Invalid Password!" });
            }
          });
        });
      }
    )
  );
  passport.serializeUser((user, done) => {
    return done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      return done(err, user);
    });
  });
};
