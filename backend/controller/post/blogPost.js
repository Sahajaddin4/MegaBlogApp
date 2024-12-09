const Post = require("../../models/postModels");
const Like=require("../../models/likeModels");
const Comment=require("../../models/commentModels");
//Create Post controller
exports.createPost = async (req, res) => {
    try {
        const { title, body, author ,id} = req.body;
        
        
         await Post.create({ title, body, author,userId:id });
        return res.status(200).json({
            message:'Post added succesfully',
        })
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({
            message:"Internal server error found!",
            error:error
        })
    }
}



//getPosts controller

exports.getAllPosts=async(req,res)=>{
    try {
        const user=req.params.id;
       
        
        const limit =parseInt(req.query.limit) || 5;
        const page =parseInt(req.query.page) || 1;
        const skip=(page-1)*limit;
        if(user==="1"){
            const [totalCount, posts] = await Promise.all([
                Post.countDocuments(), // Get the total count of documents
                Post.find({}) // Fetch the paginated posts
                  .sort({ createdAt: -1 })
                  .skip(skip)
                  .limit(limit)
              ]);
              
              const totalPage = Math.ceil(totalCount / limit);
           
            
            
        return res.status(200).json({
            message:'Post fetched  succesfully',
            data:posts,
            totalPage
        })
        }
        else if(user==="0"){
            const [totalCount, posts] = await Promise.all([
                Post.countDocuments({ approved: true }), // Get the total count of approved posts
                Post.find({ approved: true }) // Fetch the paginated approved posts
                  .sort({ createdAt: -1 })
                  .skip(skip)
                  .limit(limit)
              ]);
              
              const totalPage = Math.ceil(totalCount / limit); // Calculate total pages
              
              
              
        return res.status(200).json({
            message:'Post fetched  succesfully',
            data:posts,
            totalPage
        })
        }
        else {
            return res.status(400).json({
              message: "Invalid user type"
            });
          }
        
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({
            message:"Internal server error found!",
            error:error
        })
    }
}



//Delete a Post
exports.deletePost=async(req,res)=>{
    try {
        const { postId } = req.params;
        const {id}=req.body;
        const deleteLikes=await Like.deleteMany({post:postId});
        const deleteComments=await Comment.deleteMany({post:postId});
        
        const updatedPost = await Post.findOneAndUpdate({_id:postId,userId:id},{$set :{likes:[],comments:[]}});
        if(!updatedPost || !deleteComments || !deleteLikes){
            return res.status(400).json({
                success:false,
                message:'Faced error at deleting comments and likes',
            })
        }
        const deletedPost=await Post.findOneAndDelete({_id:postId,userId:id});
        if(!deletedPost){
            return res.status(400).json({
                success:false,
                message:'No post found of given id',
            })
        }
        return res.status(200).json({
            message:'Post deleted succesfully',
        })
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({
            message:"Internal server error found!",
            error:error
        })
    }
}



//get approval from admin
exports.postApprove=async(req,res)=>{
     try {
        const postId=req.params.id;
        const {userType}=req.body;
        if(userType==="admin")
        {
            await Post.findByIdAndUpdate(postId,{approved:true},{new:true});
            return res.status(200).json({
                message:'Post approved succesfully',
                
            })
            
        }
        return res.status(400).json({
            message:'Only admin can approve or reject',
            
        })
     } catch (error) {
        return res.status(500).json({
            message:"Internal server error found!",
            error:error
        })
     }

}

exports.approveRejectedPost=async(req,res)=>{
    try {
        const postId=req.params.id;
        const {userType}=req.body;
        if(userType==="admin")
        {
            await Post.findByIdAndUpdate(postId,{approved:true,status:"active"},{new:true});
            return res.status(200).json({
                message:'Post approved succesfully',
                
            })
            
        }
        return res.status(400).json({
            message:'Only admin can approve or reject',
            
        })
     } catch (error) {
        return res.status(500).json({
            message:"Internal server error found!",
            error:error
        })
     }

}
exports.postReject=async(req,res)=>{
    try {
        const postId=req.params.id;
        
        const {userType}=req.body;
        if(userType==="admin")
        {
            await Post.findByIdAndUpdate(postId,{status:"rejected"});
            return res.status(200).json({
                message:'Post approved succesfully',
                
            })
            
        }
        return res.status(400).json({
            message:'Only admin can approve or reject',
            
        })
     } catch (error) {
        return res.status(500).json({
            message:"Internal server error found!",
            error:error
        })
     }
}



///get individual users blogs
exports.getMyBlogs=async(req,res)=>{
    try {
          const userId=req.params.id;
          const {userType}=req.body;
          if(userType!=="user"){
            return res.status(401).json({
                message:"Only user can get his blogs."
            })
          }
          let blogs=await Post.find({userId:userId});
          if(!blogs)
          {
            return res.status(400).json({
                message:'failed to fetched user blogs',
                
              })
          }
          return res.status(200).json({
            message:'Successfully fetched user blogs',
            blogs
          });
    } catch (error) {
        console.log('error found at fetching user individual blog!');
        
        return res.status(500).json({
            message:"Internal server error found!",
            error:error
        })
    }
}

exports.getOneBlog=async(req,res)=>{
    try {
        const blogId=req.params.id;
        const {userType}=req.body;
        if(userType!=="user"){
          return res.status(401).json({
              message:"Only user can get his blogs."
          })
        }
        let blog=await Post.findById(blogId);
        if(!blog)
        {
          return res.status(400).json({
              message:'failed to fetched user blogs',
              
            })
        }
        return res.status(200).json({
          message:'Successfully fetched user blogs',
          blog
        });
  } catch (error) {
   
      
      return res.status(500).json({
          message:"Internal server error found!",
          error:error
      })
  }
}
