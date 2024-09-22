if(process.env.NODE_ENV!="production"){
    require('dotenv').config()
}

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const session=require('express-session');
const MongoStore=require('connect-mongo');
const flash=require("connect-flash");
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/user.js');


let dburl=process.env.ATLASDB_URL;

const Store=MongoStore.create({
    mongoUrl:dburl,
    crypto:{
         secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});
Store.on("error",()=>{
    console.log("Error in Mongo Session Store",err);
})

const sessionOption={
    Store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
}

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const ExpressError=require("./util/ExpressError.js");
app.use(methodOverride("_method"));

const Review=require("./models/review.js");
const reviewRouter=require('./routes/review.js');
const listingsRouter=require("./routes/listing.js");
const userRouter=require("./routes/user.js");

let MONGO_URL='mongodb://127.0.0.1:27017/wanderlust';



main().then((res)=>{
    console.log("Connected to DB");
}).catch(err => console.log(err));



async function main() {
  await mongoose.connect(dburl);
}

//Root Route...
// app.get("/",(req,res)=>{
//     res.send("Working well");
// })

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"public")));

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})

app.use('/listings',listingsRouter);
app.use('/listings/:id/reviews',reviewRouter);
app.use('/',userRouter);


app.listen(8080,()=>{
    console.log("App is listening on the port 8080");
})



app.all("*",(req,res,next)=>{
    next(new ExpressError(404,`Page Not Found`));
})
app.use((err,req,res,next)=>{
    let {code=500,message="Something Went Wrong"}=err;
    res.status(404).render("error.ejs",{err});
})


