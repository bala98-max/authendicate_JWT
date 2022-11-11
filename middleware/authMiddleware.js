const jwt = require("jsonwebtoken");

const requireAuth = (req,res,next)=>{
    const token = req.cookies.jwt;

    // check and verify the token
    if(token){
        jwt.verify(token,"jbnkjbk36389asdflkla",(err,decodedToken)=>{
            if(err){
                console.log('err',err)
                res.redirect('/login')
            }else{
                console.log('decodeToken',decodedToken)
                next()
            }
        })
    }else{
        res.redirect('/login')
    }
}

module.exports = requireAuth;