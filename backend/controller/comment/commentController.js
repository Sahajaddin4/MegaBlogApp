const Comment = require('../../models/commentModels');
const Post = require('../../models/postModels');

exports.commentPost =async(req, res)=>{
    try{
        const {comment, author, postId} = req.body;
        
        const addComment = new Comment({
            post : postId,
            author,
            comment
        });

        await addComment.save();

        // update comment data in post collection
        const updateComment = await Post.findByIdAndUpdate(postId, { $push: {comments:addComment._id} }, {new:true})
            .populate('comments').exec();

        res.status(200).json({
            message: "Comment Added Successfully",
            data: addComment
        })
    }
    catch(error){
        console.log(error.message)
        return res.status(500).json({
            message: "Comment Try error Occured in Comment"
        })
    }
}

//Get All comments
exports.getAllComments=async (req,res)=>{
    try {
        const{postId}=req.query;
       
        
        let response=await Comment.find({post:postId});
        if(response){
            return res.status(200).json({
                message:'Comment fetched succesfully',
                comments:response
            })
        }
        return res.status(200).json({
            message:'No comments found!!',
            comments:''
        })
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({
            message:'server error',
           
        })
    }  
   
}
exports.countCommentOfPost=async(req, res)=>{
    try {
        const { post } = req.query;


        let comments = await Comment.find({ post: post });

        const commentIds = comments.map((comment) => comment._id);


        if (commentIds) {
            return res.status(200).json({
                message: "Comment counted",

                countedComment: commentIds.length


            })
        }
        return res.status(400).json({
            message: "Failed to count Comments ",


        })
    } catch (error) {

        return res.status(500).json({
            message: "Internal server error found!",
            error: error
        })
    }
}


exports.removeComment=async(req, res)=>{
    try{
        const {commentId} = req.query;

        const remComment = await Comment.findByIdAndDelete(commentId);
        const postId = remComment.post;
        const updatedPost = await Post.findByIdAndUpdate(postId,{$pull: {comments: remComment._id}}, {new: true})
        .populate('comments').exec();
        
        res.status(200).json({
            message: "Commment Deleted Successfully",
            data: updatedPost
        })
    }
    catch(error){
        console.log(error.message)
        return res.status(500).json({
            message: "Remove Comment Try error Occured in Comment"
        })
    }
}
