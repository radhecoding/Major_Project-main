const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../util/wrapAsync.js");
const ExpressError=require("../util/ExpressError.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const Review=require("../models/review.js");
const Listing=require("../models/listings.js");
const {validateReview,isLoggedIn,isReviewAuthor} = require('../middleware.js');
const reviewController=require('../controllers/review.js');


//Post Route Revies
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview))

// Delete Route Reviews
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview))

module.exports=router;