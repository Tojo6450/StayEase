const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async (req, res, next) => {
    try {
        const { listingId } = req.params;
        const listing = await Listing.findById(listingId);

        if (!listing) {
            return res.status(404).json({ success: false, message: "Listing not found." });
        }
        if (!req.body.review || !req.body.review.rating || !req.body.review.comment) {
             return res.status(400).json({ success: false, message: "Rating and comment are required." });
        }

        const newReview = new Review(req.body.review);
        newReview.author = req.user._id;

        listing.reviews.push(newReview);

        await Promise.all([newReview.save(), listing.save()]);

        await newReview.populate('author', 'username');

        res.status(201).json({
            success: true,
            message: "Review added successfully!",
            review: newReview
        });

    } catch (err) {
        console.error("Error creating review:", err);
        next(err);
    }
};

module.exports.deleteReview = async (req, res, next) => {
    try {
        const { listingId, reviewId } = req.params;

        const listingUpdatePromise = Listing.findByIdAndUpdate(listingId, { $pull: { reviews: reviewId } });
        const reviewDeletePromise = Review.findByIdAndDelete(reviewId);

        const [listingUpdateResult, deletedReview] = await Promise.all([listingUpdatePromise, reviewDeletePromise]);

        if (!deletedReview) {
             return res.status(404).json({ success: false, message: "Review not found." });
        }
         if (!listingUpdateResult) {
             console.warn(`Review ${reviewId} deleted, but listing ${listingId} not found for update.`);
         }

        res.status(200).json({ success: true, message: "Review deleted successfully!" });

    } catch (err) {
        console.error("Error deleting review:", err);
        next(err);
    }
};