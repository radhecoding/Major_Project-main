const express=require("express");
const router = express.Router();
const wrapAsync=require("../util/wrapAsync.js");
const Listing=require("../models/listings.js");
const {isLoggedIn,isOwner,validateListing}=require('../middleware.js');
const ListingController=require('../controllers/listing.js');
const multer  = require('multer');
const {storage}=require('../cloudConfig.js');
const upload = multer({storage});


router.route("/")
.get(wrapAsync(ListingController.index))
.post(isLoggedIn,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(ListingController.createListings));



router.get("/new",isLoggedIn,ListingController.renderNewForm);

router.route("/:id")
.get(wrapAsync(ListingController.showListings))
.put(isLoggedIn,isOwner, upload.single('listing[image]'),validateListing,wrapAsync(ListingController.updateListings))
.delete(isLoggedIn,isOwner,wrapAsync(ListingController.destroyListings));


router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(ListingController.editForm));


module.exports=router;