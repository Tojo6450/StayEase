const Listing = require("../models/listing")

module.exports.index = async (req, res, next) => {
  try {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
  } catch (err) {
    next(err);
  }
}

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new")};

  module.exports.createListing = async (req, res, next) => {
  try {
    let url= req.file.path;
    let filename= req.file.filename;
    const data = req.body.listing;
    const newListing = new Listing(data);
    newListing.owner = req.user._id
    newListing.image = {url,filename};
    await newListing.save();
    req.flash("success","New Listing created!")
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
    console.log(listing)
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
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success","Listing updated!")
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
