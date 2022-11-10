const mongoose = require('mongoose');
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required:[true,"Please enter an email"],
        trim:true,
        unique:true,
        lowercase:true,
        validate:[isEmail, "Please enter the valid email"]
    },
    password:{
        type:String,
        required:[true,"Please enter the password"],
        minlength:[5,"minimum length should be 5"],
        maxlength:10,
    }
})

// fire a function after doc save to DB
userSchema.post('save',(doc,next)=>{
    // console.log('new user created & saved',doc);
    next()
})

//fire a function before doc saved to DB
userSchema.pre('save',async function(next){
    // (this) refers local user before save to the DB
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password,salt);
    next();

})

 userSchema.statics.login = async function(email,password){
    // console.log('email,pas',email,password)
    const user = await this.findOne({ email });
    // console.log(user)
    if(user){
        const auth = await bcrypt.compare(password,user.password);
        if(auth){
            return user;
        }
        throw Error('Incorrect password');
    }else{
        throw Error("Incorrect email");
    }
}

const User = mongoose.model('user',userSchema);
module.exports = User;