const express = require("express");
const router = express.Router({ mergeParams: true }); 
const { isLoggedIn, validateReview, isReviewAuthor } = require("../middleware"); 
const reviewController = require("../controllers/reviews");

// Create Review Route
router.post(
    "/",
    isLoggedIn, 
    validateReview,
    reviewController.createReview
);

// Delete Review Route
router.delete(
    "/:reviewId",
    isLoggedIn, 
    isReviewAuthor,
    reviewController.deleteReview
);

module.exports = router;