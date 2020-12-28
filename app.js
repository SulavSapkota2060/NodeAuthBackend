const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const morgan = require("morgan");
const userRoutes = require("./routes/UserRoutes");
const flash = require("connect-flash");
const passport = require("passport");

//APP
app = express();

// Passport config
require("./config/passport")(passport);

// Database Configuration
mongoose
  .connect(require("./config/database"), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(process.env.PORT || 9000, () => {
      console.log("Connnected to database AND Listening on PORT 9000");
    });
  });

//Middlewares
app.use(express.static("./public"));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(
  session({
    secret: "cat",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//Declaring Global Variables
app.use((req, res, next) => {
  res.locals.err_msg = req.flash("err_msg");
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error = req.flash("error");

  next();
});

// View Engine
app.set("view engine", "ejs");
app.set("views", "./views");

// Routes
app.use("/user", userRoutes);
app.use(require("./routes/mainRoutes"));
