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
           return res.status(200).json({
                success:false,
                message:"Email already exists"
            })
        }
        const hashPassword = await bcrypt.hash(password, 10);
       
       
        let userData = new User ({
            name,
            email,
            phone,
            password:hashPassword,
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


        let user=await User.findOne({email,status:"active"});
        if(!user){
            return res.status(200).json({
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
            const refreshPayload={
                id:user._id
            }
            
            const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "2h" })
            const refreshToken=jwt.sign(refreshPayload,process.env.JWT_REFRESH_SECRET_KEY,{expiresIn:'60d'})
            const options = {
                expires : new Date(Date.now() + 2 * 60* 60 *1000),
                //expires:new Date(Date.now()+2*60*1000)
                
            }
            user.refreshToken=refreshToken;
            user.expireRefreshToken=Date.now()+60 * 24 * 60 * 60 * 1000;

            await user.save();
            
            res.cookie("token", token, options);
            res.cookie("refreshToken",refreshToken,new Date(Date.now() + 60 * 24 * 60 * 60 * 1000));
            return res.status(200).json({
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


//Remove user
exports.removeUser=async(req,res)=>{
    try {
        const userId=req.params.id;
        const{userType}=req.body;
        if(userType==='admin'){
            const response=await User.findByIdAndUpdate(userId,{$set:{status:"inactive"}});
           if(response){
            return res.status(200).json({
                message:'UserList fetched successfully',
                
            });
           }
           else{
            return res.status(400).json({
                message:'Error at removing a user.',
                
            });
           }
        }
        else{
            return res.status(401).json({
                message:'Only Admin ca remove.'
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



exports.activateUser=async(req,res)=>{
    try {
        const userId=req.params.id;
        const{userType}=req.body;
        if(userType==='admin'){
            const response=await User.findByIdAndUpdate(userId,{$set:{status:"active"}},{new:true});
           if(response){
            return res.status(200).json({
                message:'User account activated again successfully',
                users:response
            });
           }
           else{
            return res.status(400).json({
                message:'Error at activating  an user account .',
                
            });
           }
        }
        else{
            return res.status(401).json({
                message:'Only Admin ca remove.'
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


exports.logOut = async (req, res) => {
    try {
        // Get the user ID from the cookies
        const { id } = req.body;
         console.log(id);
         
        // Check if the ID exists
        if (!id) {
            return res.status(400).json({
                message: 'Bad request! User ID not found in cookies.',
            });
        }

        // Find the user and update the refresh token and expiration time
        const user = await User.findByIdAndUpdate(id, { 
            refreshToken: "", 
            expireRefreshToken: null 
        });

        // Check if the user exists
        if (!user) {
            return res.status(400).json({
                message: 'User not found.',
            });
        }

        // Clear the cookies on the client side
        res.clearCookie('token');
        res.clearCookie('refreshToken');

        // Respond with success
        return res.status(200).json({
            success: true,
            message: "Logout successful",
        });
    } catch (error) {
        console.error('Logout error:', error);
        return res.status(500).json({
            success: false,
            error: error,
            message: "Server error during logout",
        });
    }
};
