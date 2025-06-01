const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate=require("ejs-mate")
const ExpressError=require("./utils/ExpressError.js");
const Review = require("./models/review.js");
const { listingSchema,reviewSchema } = require("./shema.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate)
app.use(express.static(path.join(__dirname,"/public")))

app.get("/", (req, res) => {
  res.send("Hi, I am root");
});
//Error handling
const validateListing = (req,res,next)=>{
  let {error}=listingSchema.validate(req.body)
  if(error){
    let errmsg = error.details.map((el)=>el.message).join(",");
    throw ExpressError(400,errmsg)
  }
  else{
    next()
  }
}

const validateReview = (req,res,next)=>{
  let {error}=reviewSchema.validate(req.body)
  if(error){
    let errmsg = error.details.map((el)=>el.message).join(",");
    throw ExpressError(400,errmsg)
  }
  else{
    next()
  }
}
//Index Route
app.get("/listings", async (req, res) => {
  try{
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}
catch(err){
    next(err)
  }
});

//New Route
app.get("/listings/new", (req, res) => {
  try{
    res.render("listings/new.ejs");}
  catch(err){
    next(err)
  }
});

//Show Route
app.get("/listings/:id", async (req, res) => {
  try{
  let { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews");
  res.render("listings/show.ejs", { listing });}
  catch(err){
    next(err)
  }
});

//Create Route
app.post("/listings", validateListing, async (req, res, next) => {
  try{
    const data = req.body.listing;
    if(!data){
      throw new ExpressError(400,"send valid data")
    }
  if (!data.image || data.image.trim() === "") {
    delete data.image;
  }
  const newListing = new Listing(data);
  await newListing.save();
  res.redirect("/listings");
  }
  catch(err){
    next(err)
  }
});

//Edit Route
app.get("/listings/:id/edit", async (req, res) => {
  try{
    let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
  }
  catch(err){
    next(err)
  }
});

//Update Route
app.put("/listings/:id", async (req, res) => {
  try{
     let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
  }
  catch(err){
    next(err)
  }
});

//Delete Route
app.delete("/listings/:id", async (req, res,next) => {
  try{
    let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
  }
  catch(err){
      next(err)
  }
});

//Review
app.post("/listings/:id/reviews", validateReview,async(req,res)=>{
  try{
 let listing = await Listing.findById(req.params.id)
 let newReview = new Review(req.body.review)

 listing.reviews.push(newReview)

 await newReview.save()
 await listing.save()
 res.redirect(`/listings/${listing._id}`)}
 catch(err){
  next(err)
 }
})

app.delete("/listings/:id/reviews/:reviewId", async (req,res)=>{
  let {id,reviewId }=req.params
  await Listing.findByIdAndUpdate(id,{$pull: {reviews: reviewId}});
  console.log(reviewId)
  console.log(id)
  await Review.findByIdAndDelete(reviewId)

  res.redirect(`/listings/${id}`)
})

// app.all("*", (req, res, next) => {
//   next(new ExpressError(404, "Page not found!"));
// });

app.use((err,req,res,next)=>{
  let {statusCode=500,message="hi"}=err
  res.status(statusCode).render("error.ejs",{message})
  // res.status(statusCode).send(message)
})

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});