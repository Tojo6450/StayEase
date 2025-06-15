const express = require("express");
const router = express.Router();
const { saveRedirectUrl } = require("../middleware");
const userController = require("../controllers/users");

// Signup Routes
router.get("/signup", userController.renderSignupForm);
router.post("/signup", userController.registerUser);

// Login Routes
router.get("/login", userController.renderLoginForm);
router.post("/login", saveRedirectUrl, userController.loginUser);

// Logout
router.get("/logout", userController.logoutUser);

module.exports = router;
