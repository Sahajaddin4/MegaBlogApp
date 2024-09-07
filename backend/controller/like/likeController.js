const Like = require('../../models/likeModels');
const Post = require('../../models/postModels');
const mongoose = require('mongoose');
exports.likePost = async (req, res) => {
    try {
        const { postId, author } = req.body;

        //console.log(req.body);

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
            isLiked: true,
            //data: updatedPost
        })

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Internal server error found!",
            error: error
        })
    }

}
exports.getAllLikeOfAPost = async (req, res) => {
    try {
        const { post } = req.query;


        let likes = await Like.find({ post: post });

        const likeIds = likes.map((like) => like._id);


        if (likeIds) {
            return res.status(200).json({
                message: "Likes counted",

                countedLike: likeIds.length


            })
        }
        return res.status(400).json({
            message: "Failed to count likes ",


        })
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Internal server error found!",
            error: error
        })
    }
}
exports.getLikeDataOfUser = async (req, res) => {
    try {

        const { post, author } = req.query;
       

        let likeId = await Like.findOne({ post, author });


        if (likeId) {
            return res.status(200).json({
                message: "Already liked",
                isLiked: true,
                data: likeId

            })
        }
        else {
            return res.status(200).json({
                message: `not liked yet by this ${author}`,
                isLiked: false
            })
        }

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
        const { postId, author } = req.query;

        //console.log(req.query);

        let likeId = await Like.findOne({ post: postId, author: author });


        const removeLike = await Like.findOneAndDelete(likeId);

        if (removeLike) {

            //update like data  in post collection
            const updatedPost = await Post.findByIdAndUpdate(postId, { $pull: { likes: removeLike._id } }, { new: true })
                .populate("likes").exec();
            return res.status(200).json({
                message: "post disliked succesfully",
                isLiked: false,
                data: updatedPost
                //    data: likeId['_id']
            })
        }
        else {
            return res.status(200).json({
                message: `Already disliked this post by ${author}`,
                isLiked: false,


            })
        }





    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Internal server error found!",
            error: error
        })
    }

}