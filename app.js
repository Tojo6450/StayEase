if(process.env.NODE_ENV != "production"){
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash')
const passport = require("passport")
const LocalStrategy = require("passport-local")
const User = require("./models/user.js")

const listingsRoutes = require("./routes/listings");
const reviewsRoutes = require("./routes/reviews");
const userRoutes = require("./routes/user.js");
const cartRoutes = require("./routes/cart");

const MONGO_URL = process.env.MONGO_URL
mongoose.connect(MONGO_URL).then(() => console.log("Connected to DB"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
  mongoUrl:MONGO_URL,
  crypto:{
    secret:process.env.SESSION_SECRET
  },
  touchAfter: 24*3600,
})

store.on("error",()=>{
  console.log("Error in Mongo session store",err);
})

const sessionOptions = {
  store,
  secret:process.env.SESSION_SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires: Date.now() + 7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true,
  }
}



app.use(session(sessionOptions))
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser())


app.use((req,res,next)=>{
  res.locals.success= req.flash("success");
  res.locals.error=req.flash("error")
  res.locals.curUser=req.user;
  next();
})

app.get("/", (req, res) => {
  res.render("home")
});
app.get("/ping", (req,res)=>{
  res.send("pong")
});
app.use("/listings", listingsRoutes);
app.use("/listings/:listingId/reviews", reviewsRoutes);
app.use("/",userRoutes);
app.use("/cart",cartRoutes)


app.use((req, res, next) => {
  res.status(404).render("error", { message: "Page Not Found (404)" });
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error", { message });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("Server is listening on port 8080");
});
