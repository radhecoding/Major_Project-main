const mongoose=require("mongoose");
const Review=require('./review.js');
const Schema=mongoose.Schema;

const listingSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
        url:String,
        filename:String
        // type:String,
        // default:"https://cdn.pixabay.com/photo/2023/11/20/13/48/butterfly-8401173_1280.jpg",
        // set:(v) => v===""?"https://cdn.pixabay.com/photo/2023/11/20/13/48/butterfly-8401173_1280.jpg":v,
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
    }
})

listingSchema.post("findOneAndDelete",async (listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }  
})

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;