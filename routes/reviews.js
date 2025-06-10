const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing");
const Review = require("../models/review");
const {validateReview,isLoggedin,isReviewAuthor} = require("../middleware.js")

// Create review
router.post("/", isLoggedin,validateReview, async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    listing.reviews.push(review);
    await review.save();
    await listing.save();
    req.flash("success","New review created!")
    res.redirect(`/listings/${listing._id}`);
  } catch (err) {
    next(err);
  }
});

// Delete review
router.delete("/:reviewId",isLoggedin,isReviewAuthor, async (req, res, next) => {
  try {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted!")
    res.redirect(`/listings/${id}`);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
