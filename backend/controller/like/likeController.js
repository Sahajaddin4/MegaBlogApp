const Like = require('../../models/likeModels');
const Post = require('../../models/postModels');

exports.likePost = async (req, res) => {
    try {
        const { postId, author } = req.body;

        // Ensure the post exists before liking
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: "Post not found",
            });
        }

        // Check if the post is already liked by the user
        const existingLike = await Like.findOne({ post: postId, author });
        if (existingLike) {
            return res.status(400).json({
                message: "You have already liked this post",
                isLiked: true,
            });
        }

        // Add the like
        const addLike = new Like({
            post: postId,
            author,
        });
        await addLike.save();

        // Update the post with the new like
        const updatedPost = await Post.findByIdAndUpdate(postId, { $push: { likes: addLike._id } }, { new: true })
            .populate("likes")
            .exec();

        return res.status(200).json({
            message: "Post liked successfully",
            isLiked: true,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};

exports.getAllLikeOfAPost = async (req, res) => {
    try {
        const { post } = req.query;

        // Ensure the post exists before fetching likes
        const postExists = await Post.findById(post);
        if (!postExists) {
            return res.status(404).json({
                message: "Post not found",
                countedLike: 0,
            });
        }

        let likes = await Like.find({ post: post });

        return res.status(200).json({
            message: "Likes counted successfully",
            countedLike: likes.length,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};

exports.getLikeDataOfUser = async (req, res) => {
    try {
        const { post, author } = req.query;

        let likeId = await Like.findOne({ post, author });

        if (likeId) {
            return res.status(200).json({
                message: "Already liked",
                isLiked: true,
                data: likeId,
            });
        } else {
            return res.status(200).json({
                message: `Not liked yet by ${author}`,
                isLiked: false,
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};

exports.disLikePost = async (req, res) => {
    try {
        const { postId, author } = req.query;

        // Ensure the post exists before unliking
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: "Post not found",
                isLiked: false,
            });
        }

        // Find the like entry
        let likeId = await Like.findOne({ post: postId, author });
        if (!likeId) {
            return res.status(400).json({
                message: `You haven't liked this post yet.`,
                isLiked: false,
            });
        }

        // Remove the like from the Like collection
        const removeLike = await Like.findOneAndDelete({ _id: likeId._id });

        // Update the Post collection by pulling the like
        const updatedPost = await Post.findByIdAndUpdate(postId, { $pull: { likes: removeLike._id } }, { new: true })
            .populate("likes")
            .exec();

        return res.status(200).json({
            message: "Post disliked successfully",
            isLiked: false,
            data: updatedPost,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};
