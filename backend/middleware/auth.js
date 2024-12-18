const jwt = require("jsonwebtoken");
const User=require("../models/userModel");
require('dotenv').config();
const auth=async(req,res,next)=>{
   
    try {
        const{token,refreshToken}=req.cookies;

       
        
        if(token)
        {
            try {
              let payload=jwt.verify(token,process.env.JWT_SECRET_KEY);
            req.body.userType=payload.userType;
            req.body.author=payload.name;
            req.body.id=payload.id;
             return next();
            }
            
            catch (error) {
              if(error.name==="TokenExpiredError" && refreshToken)
              {
                return await handleRefreshToken();
              }
            }
          
        }
        else if(refreshToken)
        {
          return await handleRefreshToken(req,res,next);
        }
      else{
        return res.status(401).json({
            message:'login Again..',
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



async function handleRefreshToken (req,res,next){
    try {
        const {refreshToken}=req.cookies || req.headers;
        const decode=jwt.verify(refreshToken,process.env.JWT_REFRESH_SECRET_KEY);
        let id=decode.id;

        let user=await User.findById(id);
        if(!user || !user.refreshToken  )
        {
          return res.status(400).json({ message: 'Invalid refresh token' });
        }
        
        const currentTime=Date.now();
        if(user.expireRefreshToken<currentTime)
        {
          return res.status(400).json({ message: 'Refresh token has expired' });
        }

        const payload = {
          email:user.email,
          id: user._id,
          userType:user.userType,
          isAuth: true,
          name: user.name
      }

      const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "2h" });
      
      const options = {
        expires : new Date(Date.now() + 2 * 60* 60 *1000),
       // expires:new Date(Date.now()+2*60*1000)
        
    }
      res.cookie("token", token, options);
      res.cookie("refreshToken",refreshToken,new Date(Date.now() + 60 * 24 * 60 * 60 * 1000));

       user.expireRefreshToken=Date.now()+60 * 24 * 60 * 60 * 1000;
       await user.save();
       return next();
    } catch (error) {
      console.log('server error at creating new token using refresh token!');
      return res.status(500).json({
        success:false,
        error:error,
        message:"Server Error"
    })
    }
}