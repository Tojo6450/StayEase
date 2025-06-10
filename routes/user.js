const express =require("express");
const router =express.Router();
const User = require("../models/user.js")
const passport = require("passport");
const {saveRedirectUrl} =require("../middleware.js")

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs")
});

router.post("/signup",async (req,res)=>{
    try{
    let {username,email,password} = req.body;
    // console.log(newUser)
    const newUser = new User({ email,username });
    const registeredUser = await User.register(newUser,password);
    console.log(registeredUser)
    req.login(registeredUser, (err)=>{
      if(err){
        return next(err);
      }
    req.flash("success","welcome to StayEase!")
    res.redirect("/listings");
    });
    }
    catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
})

router.get("/login",async (req,res)=>{
    res.render("users/login.ejs")
})

router.post("/login", saveRedirectUrl, (req, res, next) => {
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
});


router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "logged you out!");
        res.redirect("/listings");
    });
});



module.exports=router;