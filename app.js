const express= require('express')
const path=require('path')
const mongoose =require('mongoose')
const Listing = require("./models/listing.js");
const PORT=8000

const app=express()

mongoose.connect("mongodb://127.0.0.1:27017/wanderlust", {
}).then(() => {
    console.log("MongoDB connected");
}).catch((err) => {
    console.error("MongoDB connection error:", err);
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

//Index Route
app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
});



app.listen(PORT,()=>{
    console.log(`Server is running at port ${PORT}`)
})