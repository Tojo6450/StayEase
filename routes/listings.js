const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const {isLoggedin,isOwner,validateListing} = require("../middleware.js")
const listingController =require("../controllers/listings.js")
const multer = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage})

// Index
router.get("/", listingController.index);

// New Form
router.get("/new", listingController.renderNewForm);

// Create
router.post("/", isLoggedin,validateListing,upload.single('listing[image]'), listingController.createListing);

// Show
router.get("/:id", listingController.showListing);

// Edit Form
router.get("/:id/edit",isLoggedin, isOwner,listingController.renderEditForm);

// Update
router.put("/:id", isLoggedin,isOwner,listingController.renderUpdateForm);

// Delete
router.delete("/:id",isLoggedin,isOwner, listingController.renderDestroyForm);

module.exports = router;
