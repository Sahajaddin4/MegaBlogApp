import React, { useContext, useEffect, useState } from "react";
import { BlogContext } from "../../../contextApi/BlogContextApi";
import axios from "axios";
import { UserContext } from "../../../contextApi/userAuthContext";
import { toast } from "react-toastify";
import CommentDetails from "./CommentDetails";
import { Link } from "react-router-dom";
import LikeButton from "./LikeButton";
import CommentSection from "./CommentSection";

function Card({ post }) {
    const { isAuthenticated, user, userId } = useContext(UserContext);

    // State management
    const [isLiked, setIsLiked] = useState(false);
    const [countLike, setCountLike] = useState(post.likes.length);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);

    const [allComments, setAllComments] = useState([]);
    const [countComment, setCountComment] = useState(post.comments.length);
    const [isOpen, setIsOpen] = useState(false);
    const [closeModal, setCloseModal] = useState(true);

    const [cachedComments, setCachedComments] = useState(null);

    const { toastStyle } = useContext(BlogContext);

    const handleLike = async () => {
        if (loading) return;

        const data = { author: user, postId: post._id };

        setLoading(true);

        try {
            if (isLiked) {
                const res = await axios.delete("/api/blog/api/like-dislike/post-dislike", { params: data });
                setIsLiked(res.data.isLiked);
                setCountLike(countLike - 1);
            } else {
                const res = await axios.post("/api/blog/api/like-dislike/post-like", data);
                setIsLiked(res.data.isLiked);
                setCountLike(countLike + 1);
            }
        } catch (error) {
            toast.error("Failed to like the post", toastStyle);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getLike(post._id, user);
    }, []);

    async function getLike(post, author) {
        const data = { post, author };
        let res = await axios.get("/api/blog/api/like-dislike/get-like", { params: data });
        setIsLiked(res.data.isLiked);
    }

    const handleComment = async () => {
        if (comment === "") {
            toast.warn("Enter Comment", toastStyle);
            return;
        }

        const data = { author: user, userId: userId, postId: post._id, comment: comment };

        try {
            const res = await axios.post("/api/blog/api/comment/add-comment", data);
            toast.success(res.data.message, toastStyle);
            setCountComment(countComment + 1);
            setCachedComments(null);
        } catch (error) {
            toast.error("Server error!", toastStyle);
        } finally {
            setComment("");
        }
    };

    async function fetchcomments() {
        if (cachedComments !== null) {
            setAllComments(cachedComments);
            return;
        }

        const postDetails = { postId: post._id };
        let res = await axios.get("/api/blog/api/comment/get-all-comments", { params: postDetails });
        setAllComments(res.data.comments);
        setCachedComments(res.data.comments);
    }

    const showComments = async () => {
        await fetchcomments();
        setIsOpen(true);
        setCloseModal(false);
    };

    return (
        <div className="bg-gray-100 border border-gray-200 rounded-lg shadow-md p-4 flex flex-col w-full min-h-[35vh] hover:scale-y-110 mx-auto mb-4">
            {/* Title and Author section */}
            <div className="flex justify-between items-center mb-4">
                <p className="text-xl font-semibold text-gray-900">{post.title}</p>
                <div className="text-sm text-gray-500">By {post.author}</div>
            </div>

            {/* Description section */}
            <div className="flex-grow mb-4">
                <h1 className="text-lg font-medium text-gray-700">Description:</h1>
                <p className="text-gray-600">
                    {post.body.substring(0, 100)}
                    <Link to={`blog/${post._id}`}>
                        <button className="text-blue-600 hover:text-blue-800 font-semibold ml-2">.read more..</button>
                    </Link>
                </p>
            </div>

            {/* Like and Comment section at the bottom */}
            <div className=" flex justify-between items-center mt-4">
                <div className="flex items-center gap-2">
                    <LikeButton isAuthenticated={isAuthenticated} isLiked={isLiked} handleLike={handleLike} />
                    <span className="ml-1 text-gray-600">{countLike}</span>
                </div>

                <div className="flex items-center gap-3">
                    <CommentSection showComments={showComments} comment={comment} setComment={setComment} handleComment={handleComment} />
                    <span>{countComment}</span>
                </div>
            </div>

            {/* Comments Modal */}
            {isOpen && allComments && (
                <div className="fixed inset-2 bg-gray-800 bg-opacity-50 flex items-center justify-center z-10">
                    <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
                        <CommentDetails comments={allComments} setCloseModal={setCloseModal} setIsOpen={setIsOpen} closeModal={closeModal} fetchcomments={fetchcomments} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default Card;
