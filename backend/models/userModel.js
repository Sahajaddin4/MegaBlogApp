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
        type:Number,
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
    password:{
        type:String,
        required:true
    }
});

module.exports = mongoose.model("User", userSchema);
