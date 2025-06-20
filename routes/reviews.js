const express = require("express");
const router = express.Router({ mergeParams: true });
const { isLoggedin, validateReview, isReviewAuthor } = require("../middleware");
const reviewController = require("../controllers/reviews");

router.post("/", isLoggedin, validateReview, reviewController.createReview);

router.delete("/:reviewId", isLoggedin, isReviewAuthor, reviewController.deleteReview);

module.exports = router;
