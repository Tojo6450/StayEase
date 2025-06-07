const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const { listingSchema } = require("../shema");
const ExpressError = require("../utils/ExpressError");

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errmsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errmsg);
  } else {
    next();
  }
};

// Index
router.get("/", async (req, res, next) => {
  try {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
  } catch (err) {
    next(err);
  }
});

// New Form
router.get("/new", (req, res) => {
  res.render("listings/new");
});

// Create
router.post("/", validateListing, async (req, res, next) => {
  try {
    const data = req.body.listing;
    if (!data.image || data.image.trim() === "") delete data.image;
    const newListing = new Listing(data);
    await newListing.save();
    req.flash("success","New Listing created!")
    res.redirect("/listings");
  } catch (err) {
    next(err);
  }
});

// Show
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
      req.flash("error","Listing you created for does not exist!")
      res.redirect("/listings");
    }
    else res.render("listings/show", { listing });
  } catch (err) {
    next(err);
  }
});

// Edit Form
router.get("/:id/edit", async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error","Listing you created for does not exist!")
      res.redirect("/listings");
    }
    else {
      res.render("listings/edit", { listing });
    }
  } catch (err) {
    next(err);
  }
});

// Update
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success","Listing updated!")
    res.redirect(`/listings/${id}`);
  } catch (err) {
    next(err);
  }
});

// Delete
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
    req.flash("success","Listing deleted!")
  } catch (err) {
    next(err);
  }
});

module.exports = router;
