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

exports.removeComment=async(req, res)=>{
    try{
        const {commentId, postId} = req.body;

        const remComment = await Comment.findByIdAndDelete(commentId);

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
