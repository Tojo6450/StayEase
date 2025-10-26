const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res, next) => {
    try {
        const { category, search } = req.query;
        let query = {};

        if (category) {
            query.category = category;
        }

        if (search) {
            const searchRegex = new RegExp(search, 'i');
            query.$or = [
                { title: searchRegex },
                { country: searchRegex },
                { location: searchRegex }
            ];
        }

        const allListings = await Listing.find(query).populate('owner', 'username');
        res.status(200).json(allListings);
    } catch (err) {
        next(err);
    }
};

module.exports.createListing = async (req, res, next) => {
    try {
        if (!req.body.listing) {
             return res.status(400).json({ success: false, message: 'Listing data is missing.' });
        }
        if (!req.file) {
             return res.status(400).json({ success: false, message: 'Listing image is required.' });
        }

        let geoResponse;
        try {
             geoResponse = await geocodingClient.forwardGeocode({
                query: req.body.listing.location,
                limit: 1,
            }).send();
        } catch(geoErr) {
            console.error("Geocoding failed:", geoErr);
            return res.status(400).json({ success: false, message: 'Invalid location provided or geocoding service error.' });
        }


        if (!geoResponse || !geoResponse.body || !geoResponse.body.features || geoResponse.body.features.length === 0) {
            return res.status(400).json({ success: false, message: 'Could not find coordinates for the provided location.' });
        }

        const url = req.file.path;
        const filename = req.file.filename;
        const data = req.body.listing;

        const newListing = new Listing({
            ...data,
            owner: req.user._id,
            image: { url, filename },
            geometry: geoResponse.body.features[0].geometry
        });

        const savedListing = await newListing.save();
        const populatedListing = await Listing.findById(savedListing._id).populate('owner', 'username');

        res.status(201).json({
            success: true,
            message: "New listing created successfully!",
            listing: populatedListing
        });

    } catch (err) {
        next(err);
    }
};

module.exports.showListing = async (req, res, next) => {
    try {
        const { listingId } = req.params;
        const listing = await Listing.findById(listingId)
            .populate({
                path: "reviews",
                populate: {
                    path: "author",
                    select: "username"
                }
            })
            .populate("owner", "username");

        if (!listing) {
            return res.status(404).json({ success: false, message: "Listing not found." });
        }

        res.status(200).json(listing);

    } catch (err) {
        if (err.name === 'CastError') {
             return res.status(400).json({ success: false, message: 'Invalid listing ID format.' });
        }
        next(err);
    }
};

module.exports.updateListing = async (req, res, next) => {
    try {
        const { listingId } = req.params;
        const data = req.body.listing;

        if (!data) {
             return res.status(400).json({ success: false, message: 'Listing update data is missing.' });
        }

        let listing = await Listing.findById(listingId);
        if (!listing) {
            return res.status(404).json({ success: false, message: "Listing not found." });
        }

        let geometry = listing.geometry;
        if (data.location && data.location !== listing.location) {
             try {
                const geoResponse = await geocodingClient.forwardGeocode({
                    query: data.location,
                    limit: 1,
                }).send();

                if (geoResponse && geoResponse.body && geoResponse.body.features && geoResponse.body.features.length > 0) {
                     geometry = geoResponse.body.features[0].geometry;
                } else {
                     console.warn(`Could not geocode updated location: ${data.location}`);
                }
             } catch(geoErr) {
                 console.error("Geocoding failed during update:", geoErr);
             }
        }

        const updateData = { ...data, geometry };

        if (req.file) {
            updateData.image = { url: req.file.path, filename: req.file.filename };
        } else if (data.image === null || data.image === '') {
             updateData.image = undefined;
        }

        const updatedListing = await Listing.findByIdAndUpdate(listingId, updateData, {
            new: true,
            runValidators: true
        }).populate('owner', 'username');

        res.status(200).json({
            success: true,
            message: "Listing updated successfully!",
            listing: updatedListing
        });

    } catch (err) {
         if (err.name === 'CastError') {
             return res.status(400).json({ success: false, message: 'Invalid listing ID format.' });
        }
        next(err);
    }
};

module.exports.destroyListing = async (req, res, next) => {
    try {
        const { listingId } = req.params;
        const deletedListing = await Listing.findByIdAndDelete(listingId);

        if (!deletedListing) {
            return res.status(404).json({ success: false, message: "Listing not found." });
        }

        res.status(200).json({ success: true, message: "Listing deleted successfully!" });

    } catch (err) {
         if (err.name === 'CastError') {
             return res.status(400).json({ success: false, message: 'Invalid listing ID format.' });
        }
        next(err);
    }
};