const Like = require('../../models/likeModels');
const Post = require('../../models/postModels');

exports.likePost = async (req, res) => {
    try {
        const { postId ,author } = req.body;

        const addLike = new Like({
            post: postId,
            author
        })
        await addLike.save();

        //update like data  in post collection
        const updatedPost = await Post.findByIdAndUpdate(postId, { $push: { likes: addLike._id } }, { new: true })
            .populate("likes").exec();

        
            return res.status(200).json({
            message: "post liked succesfully",
            data:updatedPost
        })

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Internal server error found!",
            error: error
        })
    }

}



exports.disLikePost = async (req, res) => {
    try {
        const {postId,likeId} = req.body;

        const removeLike=await Like.findOneAndDelete(likeId);

        //update like data  in post collection
        const updatedPost = await Post.findByIdAndUpdate(postId, { $pull: { likes: removeLike._id } }, { new: true })
            .populate("likes").exec();

        
            return res.status(200).json({
            message: "post disliked succesfully",
            data:updatedPost
        })

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Internal server error found!",
            error: error
        })
    }

}