const mongoose=require('mongoose');
const notificationSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        require:true
        },
    author:{
        type:String,
        default:'Anonymous'
    }  ,
    desc:{
        type:String,
        require:true
    }  ,
    mark:{
        type:Boolean,
        default:false
    },
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'post'
    }
},{timestamps:true});

module.exports=mongoose.model('Notification',notificationSchema);