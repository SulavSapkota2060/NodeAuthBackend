const express = require("express");
const router = express.Router();
const controllers = require("../controllers/UserControllers");
const allow = require("../config/auth");

router.get("/login", controllers.loginView);
router.get("/register", controllers.registerView);
router.post("/login", controllers.loginUser);
router.post("/register", controllers.registerUser);
router.get("/dashboard", allow, controllers.dashboard);
router.get("/profile", allow, controllers.profile);
router.get("/logout", allow, controllers.logout);
router.get("/changePassword", allow, controllers.changePasswordView);
router.post("/changePassword", allow, controllers.changePassword);

module.exports = router;
