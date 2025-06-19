const Listing = require("../models/listing")
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken});

module.exports.index = async (req, res, next) => {
  try {
     const { category, search } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { country: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    const allListings = await Listing.find(query);
    res.render("listings/index", { allListings, search, category });
  } catch (err) {
    next(err);
  }
}

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new")};

module.exports.createListing = async (req, res, next) => {
  try {
    let response = await geocodingClient.forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    }).send();

    let url = req.file.path;
    let filename = req.file.filename;

    const data = req.body.listing;

    const newListing = new Listing({
      ...data,  
      owner: req.user._id,
      image: { url, filename },
      geometry: response.body.features[0].geometry
    });

    let savedListing = await newListing.save();
    console.log(savedListing);

    req.flash("success", "New Listing created!");
    res.redirect("/listings");
    
  } catch (err) {
    next(err);
  }
}


module.exports.showListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate({
      path:"reviews",
      populate:{
        path:"author",
      }
    })
      .populate("owner");
    if(!listing){
      req.flash("error","Listing you created for does not exist!")
      res.redirect("/listings");
    }
    // console.log(listing)
     res.render("listings/show", { listing });
  } catch (err) {
    next(err);
  }
}

module.exports.renderEditForm = async (req, res, next) => {
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
}


module.exports.renderUpdateForm = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body.listing;

    const response = await geocodingClient.forwardGeocode({
      query: data.location,
      limit: 1,
    }).send();

    let listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }

    listing.title = data.title;
    listing.description = data.description;
    listing.price = data.price;
    listing.country = data.country;
    listing.location = data.location;
    listing.category = data.category;
    listing.geometry = response.body.features[0].geometry;

    // If new image uploaded
    if (req.file) {
      listing.image = {
        url: req.file.path,
        filename: req.file.filename
      };
    }

    await listing.save();
    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
  } catch (err) {
    next(err);
  }
}


module.exports.renderDestroyForm = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
    req.flash("success","Listing deleted!")
  } catch (err) {
    next(err);
  }
}
