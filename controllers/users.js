const User = require("../models/user");
const passport = require("passport");

// Render SignUp Page
module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

// Register User
module.exports.registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to StayEase!");
      res.redirect("/listings");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
};

// Render Login Page
module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

// Login User
module.exports.loginUser = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      req.flash("error", "Invalid username or password.");
      return res.redirect("/login");
    }

    req.login(user, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome back to StayEase!");
      const redirectUrl = res.locals.redirectUrl || "/listings";
      res.redirect(redirectUrl);
    });
  })(req, res, next);
};

// Logout User
module.exports.logoutUser = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "Logged you out!");
    res.redirect("/listings");
  });
};
