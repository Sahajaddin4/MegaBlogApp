const jwt = require("jsonwebtoken");
require('dotenv').config();
const auth=async(req,res,next)=>{
   
    try {
        const{token}=req.cookies;

       
        
        if(token)
        {
            let payload=jwt.verify(token,process.env.JWT_SECRET_KEY);
            req.body.author=payload.name;
          next();
        }
      else{
        return res.status(400).json({
            message:'login first..',
          })
      }
    } catch (error) {
        console.log(error);
        
        return  res.status(500).json({
            message:'server error in authentication',
          })
    }
    
}


module.exports=auth;