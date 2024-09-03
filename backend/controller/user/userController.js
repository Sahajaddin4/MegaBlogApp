const User = require("../../models/userModel");

exports.userSignup = async(req,res)=>{
    try{
        const {name, email, password, confirmPassword} = req.body;
        
        // Validation
        let user=User.find({email});
        if(user){
           return res.status(400).json({
                success:true,
                message:"Email already exists"
            })
        }
        let userData = new User ({
            name,
            email,
            password,
            confirmPassword
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
    catch{
        return res.status(500).json({
            success:true,
            message:"Server Error"
        })
    }
}


//Login controller

exports.userLogin=async(req,res)=>{
    try{
        const { email, password} = req.body;
        
        // Validation

       

        let response = await User.find({
            email,
            password
        });

        if(response){
            return res.status(200).json({
                success:true,
                data: response.data,
                message:"Login successful..."
            })
        }
        return res.status(400).json({
            success:true,
            message:"data not found .. create account first"
        })

    }
    catch{
        return res.status(500).json({
            success:false,
            message:"Server Error"
        })
    }
}