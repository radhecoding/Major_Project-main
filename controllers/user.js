const User=require("../models/user.js");

module.exports.renderSignupForm=(req,res)=>{
    res.render('./user/signup.ejs');
}

module.exports.createSignup=async(req,res)=>{
    try{
        let {username,email,password}=req.body;
        let newUser=new User({email,username});
        const registerUser=await User.register(newUser,password);
        req.login(registerUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash('success','Welcome to WanderLust');
            res.redirect('/listings');
        })
    }catch(err){
        req.flash('error',err.message);
        res.redirect('/signup');
    }
}

module.exports.renderLoginForm=(req,res)=>{
    res.render('./user/login.ejs')
}

module.exports.login=async(req,res)=>{
    req.flash('success','Welcome Back To WanderLust');
    let redirectUrl=res.locals.redirectUrl||'/listings'
    res.redirect(redirectUrl);
}

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash('success',"Logged You Out");
        res.redirect('/listings');
    })
}
