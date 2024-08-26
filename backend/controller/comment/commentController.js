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

// exports.removeComment=asyn(req, res)=>{

// }
