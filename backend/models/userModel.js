const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    userType:{
        type:String,
        required:true,
        default:'user'
    },
    createdBy:{
        type:String,
        default:'user'
    },
    status:{
        type:String,
        default:"active"
    },
    password:{
        type:String,
        required:true
    },
    refreshToken:{
        type:String,
        required:false,
        default:null
    },
    expirationTime:{
        type:Date,
        required:false,
        default:null
    }
});

module.exports = mongoose.model("User", userSchema);
