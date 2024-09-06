//All import 
const mongoose=require('mongoose');

//Schema 
const postSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
        maxLength:50
    },
    body:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true,
        default:'Anonymous'
    },
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Like"
    }],
    comments:[{
         type:mongoose.Schema.Types.ObjectId,
         ref:"Comment"
    }],
    // createdAt:{
    //     type:String,
    //     required:true,
    //     default:new Date()
    // }
},{ timestamps: true });


//Model
module.exports=mongoose.model('Post',postSchema);



