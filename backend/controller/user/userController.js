const User = require("../../models/userModel");

exports.userSignup = async(req,res)=>{
    try{
        const {name, email, password, confirmPassword} = req.body;
        
        // Validation

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
        return res.status(500).json({
            success:true,
            message:"Server Error"
        })

    }
    catch{
        return res.status(500).json({
            success:true,
            message:"Server Error"
        })
    }
}