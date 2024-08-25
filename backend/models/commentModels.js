//All import 
const mongoose=require('mongoose');

//Schema 
const commentSchema=new mongoose.Schema({
    comment:{
        type:String,
        required:true,
    },
    
    author:{
        type:String,
        required:true,
        default:'Anonymous'
    },
    
   post:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Post"
   }
});


//Model
module.exports=mongoose.model('Comment',commentSchema);



