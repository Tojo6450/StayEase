if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const cors = require("cors");

const listingsRoutes = require("./routes/listings");
const reviewsRoutes = require("./routes/reviews");
const userRoutes = require("./routes/user.js");
const cartRoutes = require("./routes/cart");

const MONGO_URL = process.env.MONGO_URL;
mongoose.connect(MONGO_URL)
    .then(() => console.log("Connected to DB"))
    .catch((err) => console.error("DB Connection Error:", err));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

app.use(cors({
    origin: ["http://localhost:5173","https://trip-z-xi.vercel.app"],
    credentials: true
}));

const store = MongoStore.create({
    mongoUrl: MONGO_URL,
    crypto: {
        secret: process.env.SESSION_SECRET || 'fallback-secret-for-dev'
    },
    touchAfter: 24 * 3600,
});

store.on("error", (err) => {
    console.log("Error in Mongo session store", err);
});

const sessionOptions = {
    store,
    secret: process.env.SESSION_SECRET || 'fallback-secret-for-dev',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};

app.use(session(sessionOptions));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", (req, res) => {
    res.json({ message: "Welcome to the StayEase API" });
});

app.get("/ping", (req, res) => {
    res.send("pong");
});

app.get("/me", (req, res) => {
    if (req.isAuthenticated()) {
        const { _id, username, email } = req.user;
        res.json({ user: { _id, username, email } });
    } else {
        res.status(401).json({ user: null });
    }
});

app.use("/listings", listingsRoutes);
app.use("/listings/:listingId/reviews", reviewsRoutes);
app.use("/", userRoutes);
app.use("/cart", cartRoutes);

// app.use('/api/*', (req, res, next) => {
//     res.status(404).json({ message: "API Endpoint Not Found (404)" });
// });

app.use((err, req, res, next) => {

    const { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).json({ message });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server started `);
});