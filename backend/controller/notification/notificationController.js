const Notification=require('../../models/notificationModel');
const { notify } = require('../../routes/blogRoutes');

exports.getAdminNotification= async (req,res)=>{
     try {  
         const notifyData=await Notification.find({mark:false}).sort({'createdAt':-1}).select('author desc createdAt');
        if(notifyData)
        {
            return res.status(200).json({
                success:true,
                data: notifyData,
                message:" notification Fetched successfully."
            })
        }
    
     } catch (error) {
        console.log(error);
         return res.status(500).json({
            success:false,
            error:error,
            message:"faced Server Error to get Notification"
        })
     }
}