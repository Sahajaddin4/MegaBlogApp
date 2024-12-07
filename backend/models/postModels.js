//All import 
const mongoose=require('mongoose');

//Schema 
const postSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
        maxLength:50
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
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
    approved:{
        type:Boolean,
        default:false
    },
    status:{
        type:String,
        default:"active"
    }
   
},{ timestamps: true });


//Model
module.exports=mongoose.model('Post',postSchema);



