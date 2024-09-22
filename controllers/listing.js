const Listing=require('../models/listings.js');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient=mbxGeocoding({accessToken:mapToken});

module.exports.index=async(req,res,next)=>{
    let allListings=await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
}

module.exports.renderNewForm=(req,res)=>{
    res.render("./listings/new.ejs");
}

module.exports.showListings=async(req,res)=>{
    let {id}=req.params;
    let list=await Listing.findById(id)
    .populate({
        path:"reviews",
        populate:{
            path:"author",
        },
    })
    .populate('owner');
    console.log(list);
    if(!list){
        req.flash("error","Listing you trying to access does't exit!");
        res.redirect('/listings');
    }else{
        res.render("./listings/show.ejs",{list});
    }
    
    }

module.exports.createListings=async (req,res,next)=>{
    let response=await geocodingClient
    .forwardGeocode({
        query: req.body.listing.location,
        limit:1
      })
    .send()
    let url=req.file.path;
    let filename=req.file.name;
    let newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};

    newListing.geometry= response.body.features[0].geometry;

    let result=await newListing.save();
    console.log(result);
    req.flash("success","New Listings Created!");
    res.redirect("/listings");
}

module.exports.updateListings=async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file !=="undefined"){
    let url=req.file.path;
    let filename=req.file.name;
    listing.image={url,filename};
    await listing.save();
    }
    req.flash("success","Listings Updated!");
    res.redirect(`/listings/${id}`);
    }

module.exports.editForm=async (req,res)=>{
        let {id}=req.params;
        let listings=await Listing.findById(id);
        if(!listings){
            req.flash("error","Listing you trying to access does't exit!");
            res.redirect('/listings');
        }else{
            let originalImageUrl=listings.image.url;
            originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250")
            res.render("./listings/edit.ejs",{listings,originalImageUrl});
        }
           

}

module.exports.destroyListings=async (req,res)=>{
    let {id}=req.params;
    let data=await Listing.findByIdAndDelete(id);
    req.flash("success","Listings Deleted!");
    res.redirect("/listings");
}