const Comment = require('../../models/commentModels');
const Post = require('../../models/postModels');

exports.commentPost = async (req, res) => {
    try {
        const { comment, author, userId, postId } = req.body;

        // Ensure post exists before commenting
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: "Post not found",
            });
        }

        const addComment = new Comment({
            post: postId,
            author,
            userId,
            comment,
        });

        await addComment.save();

        // Update comment data in the post collection
        const updateComment = await Post.findByIdAndUpdate(postId, { $push: { comments: addComment._id } }, { new: true })
            .populate('comments')
            .exec();

        if (!updateComment) {
            return res.status(400).json({
                message: "Failed to update Post collection",
            });
        }

        return res.status(200).json({
            message: "Comment Added Successfully",
            data: addComment,
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            message: "Error occurred while adding comment",
        });
    }
};

// Get All comments
exports.getAllComments = async (req, res) => {
    try {
        const { postId } = req.query;

        // Ensure post exists before fetching comments
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: "Post not found",
                comments: [],
            });
        }

        const response = await Comment.find({ post: postId });
        if (response.length === 0) {
            return res.status(200).json({
                message: 'No comments found!!',
                comments: [],
            });
        }

        return res.status(200).json({
            message: 'Comments fetched successfully',
            comments: response,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Server error',
        });
    }
};

// Count comments of a post
exports.countCommentOfPost = async (req, res) => {
    try {
        const { post } = req.query;

        // Ensure post exists before counting comments
        const postExists = await Post.findById(post);
        if (!postExists) {
            return res.status(404).json({
                message: "Post not found",
                countedComment: 0,
            });
        }

        const comments = await Comment.find({ post: post });

        if (comments) {
            return res.status(200).json({
                message: "Comment counted",
                countedComment: comments.length,
            });
        }

        return res.status(400).json({
            message: "Failed to count Comments",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};

// Remove comment
exports.removeComment = async (req, res) => {
    try {
        const { commentId, userId } = req.query;

        // Ensure the comment exists and belongs to the user
        const remComment = await Comment.findOne({ _id: commentId, userId: userId });
        if (!remComment) {
            return res.status(403).json({
                message: "Only the comment owner can delete the comment.",
                success: false,
            });
        }

        const postId = remComment.post;

        // Delete the comment from the Comment collection
        const deletedComment = await Comment.findByIdAndDelete(commentId);
        if (!deletedComment) {
            return res.status(404).json({
                message: "Comment not found or already deleted",
                success: false,
            });
        }

        // Update the Post collection by removing the comment from the comments array
        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { $pull: { comments: commentId } },
            { new: true }
        ).populate('comments').exec();

        return res.status(200).json({
            success: true,
            message: "Comment Deleted Successfully",
            data: updatedPost,
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Error occurred while deleting comment",
        });
    }
};
