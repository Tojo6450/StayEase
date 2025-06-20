const Listing=require("./models/listing.js")
const Review=require("./models/review.js")
const { listingSchema ,reviewSchema} = require("./schema");
const ExpressError = require("./utils/ExpressError");

module.exports.isLoggedin = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        // console.log(req.originalUrl);
        req.flash("error","You must be logged in !");
        return res.redirect("/login");
    }
    next()
}

module.exports.saveRedirectUrl = (req,res,next)=>{
  // console.log(req.session.redirectUrl)
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}
module.exports.isOwner=async (req,res,next)=>{
    let {listingId}=req.params;
    let listing=await Listing.findById(listingId);
    if(!listing.owner.equals(res.locals.curUser._id)){
        req.flash("error","You are not the owner of this listing");
        return res.redirect(`/listings/${listingId}`);
    }
    next();
}

module.exports.isReviewAuthor = async(req,res,next)=>{
  let {listingId,reviewId}=req.params;
  let review = await Review.findById(reviewId);
  if(!review.author.equals(res.locals.curUser._id)){
    req.flash("error","You are not the author of this review");
    return res.redirect(`/listings/${listingId}`);
  }
  next()
}
module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errmsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errmsg);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    let errmsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errmsg);
  }
  next();
};

module.exports.isLoggedIn = (req, res, next)=> {
    if (req.isAuthenticated()) {
        return next();
    }
    // Instead of redirect, send 401
    res.status(401).json({ success: false, message: 'Unauthorized' });
}