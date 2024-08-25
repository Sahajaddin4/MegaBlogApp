//All import 
const mongoose=require('mongoose');

//Schema 
const likeSchema=new mongoose.Schema({
   
    
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
module.exports=mongoose.model('Like',likeSchema);



