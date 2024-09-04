const { decrypt } = require("dotenv");
const User = require("../../models/userModel");

exports.userSignup = async(req,res)=>{
    try{
        const {name, email, password} = req.body;
        
        // Validation
        let user = User.find({email});
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
            password: hashPassword
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


        let user=User.find({email});
        if(!user){
            return res.status(400).json({
                success:false,
                message: "User does not exist"
            })
        }
       
        password = await bcrypt.compare(password,user.password)

        if(password){
            return res.status(200).json({
                success:true,
                data: response.data,
                message:"Login successful..."
            })
        }
        else{
            return res.status(400).json({
                success:true,
                message:"Password Does not match"
            })
        }

    }
    catch{
        return res.status(500).json({
            success:false,
            message:"Server Error"
        })
    }
}