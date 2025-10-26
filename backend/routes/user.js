const express = require("express");
const router = express.Router();
const userController = require("../controllers/users");
const passport = require('passport');

router.post("/signup", userController.registerUser);

router.post(
    "/login",
    passport.authenticate("local"),
    userController.loginUser
);

router.get("/logout", userController.logoutUser);

module.exports = router;