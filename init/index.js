const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listings.js");


main().then((res)=>{
    console.log("Connected to DB");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initDb=async ()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj,owner:'659f81b03334d14caa6d749e'}));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
}

initDb();