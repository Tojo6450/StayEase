const express = require("express");
const router = express.Router();
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js"); 
const listingController = require("../controllers/listings.js");
const multer = require('multer');
const { storage } = require("../cloudConfig.js"); 
const upload = multer({ storage });

// Index Route: Get all listings
router.get("/", listingController.index);

// Create Route: Add a new listing
router.post(
    "/",
    isLoggedIn,
    upload.single('listing[image]'),
    validateListing,
    listingController.createListing
);

// Show Route: Get a specific listing by ID
router.get("/:listingId", listingController.showListing);

// Update Route: Update a specific listing by ID
router.put(
    "/:listingId",
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'), 
    validateListing,
    listingController.updateListing 
);

// Delete Route: Delete a specific listing by ID
router.delete(
    "/:listingId",
    isLoggedIn,
    isOwner,
    listingController.destroyListing 
);

module.exports = router;