const  bcrypt  = require("bcrypt");
const User = require("../../models/userModel");
const jwt = require('jsonwebtoken')
require("dotenv").config();

exports.userSignUpByAdmin=async(req,res)=>{
    try{
        const {name, email, password,phone,userType} = req.body;
     
      
        if(userType==="user"){
            return   res.status(401).json({
                success:false,
                message:"Only Admin Can add user here"
            })
        }
        // Validation
      else{
        let user =await User.findOne({email});
        if(user){
           return res.status(400).json({
                success:false,
                message:"Email already exists"
            })
        }
        const hashPassword = await bcrypt.hash(password, 10);
       
       
        let userData = new User ({
            name,
            email,
            phone,
            createdBy:'admin',
            password:hashPassword
        })
      
        
        let response = await userData.save();

         if(response){
            return res.status(200).json({
                success:true,
                data: response.data,
                message:"Account created Successfully"
            })
        }
        return res.status(400).json({
            success:false,
            message:"Failed to create account!"
        })

      }
    }
    catch(error){
     
        
        return res.status(500).json({
            success:false,
            error:error,
            message:"Server Error"
        })
    }
}
exports.userSignup = async(req,res)=>{
    try{
        const {name, email, password,phone} = req.body;
      
        
        // Validation
        let user =await User.findOne({email});
        if(user){
           return res.status(400).json({
                success:true,
                message:"Email already exists"
            })
        }
        const hashPassword = await bcrypt.hash(password, 10);
       
       
        let userData = new User ({
            name,
            email,
            phone,
            password:hashPassword
        })
      
        
        let response = await userData.save();

         if(response){
            return res.status(200).json({
                success:true,
                data: response.data,
                message:"Account created Successfully"
            })
        }
        return res.status(400).json({
            success:false,
            message:"Failed to create account!"
        })

    }
    catch(error){
        console.log(error);
        
        return res.status(500).json({
            success:false,
            error:error,
            message:"Server Error"
        })
    }
}


//Login controller

exports.userLogin=async(req,res)=>{
    try{
        const { email, password} = req.body;
        
        // Validation


        let user=await User.findOne({email});
        if(!user){
            return res.status(400).json({
                success:false,
                message: "User does not exist"
            })
        }
       
        const isPasswordMatched = await bcrypt.compare(password,user.password)


        if(isPasswordMatched){
            const payload = {
                email:user.email,
                id: user._id,
                userType:user.userType,
                isAuth: true,
                name: user.name
            }

            const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "2h" })

            const options = {
                expires : new Date(Date.now() + 3 * 60* 60 *1000),
                
            }

            res.cookie("token", token, options).status(200).json({
                    success:true,
                    user:user.name,
                    userType:user.userType,
                    token:token,
                    message:"Login successful..."
                })
          
        }
        else{
            return res.status(400).json({
                success:false,
                message:"Password Does not match"
            })
        }

    }
    catch(e){
        console.log(e);
        
        return res.status(500).json({
            success:false,
            error:e,
            message:"Server Error"
        })
    }
}



//get all users
exports.getUsers=async(req,res)=>{
   try {
    const{userType}=req.body;
    if(userType==='admin'){
        const userLists=await User.find({userType:'user'});
        return res.status(200).json({
            message:'UserList fetched successfully',
            userLists
        })
    }
   } catch (error) {
    return res.status(500).json({
        success:false,
        error:error,
        message:"Server Error"
    })
   }
}