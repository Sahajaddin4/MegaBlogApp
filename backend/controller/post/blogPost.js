const Post = require("../../models/postModels");

//Create Post controller
exports.createPost = async (req, res) => {
    try {
        const { title, body, author } = req.body;
        
        
        const addPost = await Post.create({ title, body, author });
         res.status(200).json({
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

exports.getAllPosts=async(_,res)=>{
    try {
        const posts = await Post.find({});
        res.status(200).json({
            message:'Post fetched  succesfully',
            data:posts
        })
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
        
        const deletedPost = await Post.findByIdAndDelete({_id:postId});
        if(!deletedPost){
            return res.status(200).json({
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