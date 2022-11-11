const User = require("../models/user");
const jwt = require('jsonwebtoken')

//handle error;

const handleError = function(err){
    console.log('err.msg',err.message)
    // message property contain the cause of the error
    let errors = {}
    // this is for uniq email
    if(err.code == 11000){
        errors['email'] = "This email is already exist"
    }
    // set the email and password error msg
    if(err.message.includes("user validation failed")){
        Object.values(err.errors).forEach(({properties})=>{
            // console.log(properties)
            errors[properties.path] = properties.message;
        })
    }

    if(err.message.includes("Incorrect password")){
        errors['password'] = "This password is incorrect";
    }
    if(err.message.includes("Incorrect email")){
        errors['email'] = "This email is not registered";
    }
    return errors;
}

const maxAge = 3 * 24 * 60 * 60; // 3days 
//create a token
const createToken = (id)=>{
    return jwt.sign({id},'jbnkjbk36389asdflkla',{
        expiresIn: maxAge
    })
}



module.exports.signup_get = (req,res)=>{
    res.render('signup')
}

module.exports.login_get = (req,res)=>{
    res.render('login')
}

module.exports.signup_post = async(req,res)=>{
    const { email, password } = req.body;
    try {
        const user = await User.create({email,password});
        // create a token
        const token = createToken(user._id);
        // setting the cookie 
        res.cookie('jwt',token,{ httpOnly: true, maxAge: maxAge * 1000})
        res
            .status(201)
            .json({user:user._id})

    } catch (err) {
        // console.log('err',err);
        let errMsg = await handleError(err);
        res
        .status(400)
        .json(errMsg)
    }
}

module.exports.login_post = async(req,res)=>{
    console.log('api called',req.body)
    const { email, password } = req.body;
    try {
        const user = await User.login(email,password);
        // create a token
        const token = createToken(user._id);
        // setting the cookie 
        res.cookie('jwt',token,{ httpOnly: true, maxAge: maxAge * 1000})
        res
            .status(200)
            .json({user:user._id})
    } catch (err) {
        console.log('error',err)
        let errorMsg = await handleError(err)
        res
        .status(400)
        .json({errorMsg})
    }
}

module.exports.logout_get = async(req,res)=>{
    res.cookie('jwt','',{maxAge:1});
    res.redirect('/');
}