const express = require("express");
const router = express.Router();
const {isLoggedin,isOwner,validateListing} = require("../middleware.js")
const listingController =require("../controllers/listings.js")
const multer = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage})

// Index
router.get("/", listingController.index);

// New Form
router.get("/new",isLoggedin, listingController.renderNewForm);

// Create
router.post("/", isLoggedin,upload.single('listing[image]'),validateListing, listingController.createListing);

// Show
router.get("/:listingId", listingController.showListing);

// Edit Form
router.get("/:listingId/edit",isLoggedin, isOwner,listingController.renderEditForm);

// Update
router.put("/:listingId", isLoggedin,isOwner,upload.single('listing[image]'),validateListing, listingController.renderUpdateForm);

// Delete
router.delete("/:listingId",isLoggedin,isOwner, listingController.renderDestroyForm);

module.exports = router;
