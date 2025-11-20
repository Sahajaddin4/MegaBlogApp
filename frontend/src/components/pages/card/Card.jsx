import React, { useContext, useEffect, useState } from "react";
import { BlogContext } from "../../../contextApi/BlogContextApi";
import axios from "axios";
import { UserContext } from "../../../contextApi/UserAuthContext";
import { toast } from "react-toastify";
import CommentDetails from "./CommentDetails";
import { Link } from "react-router-dom";
import LikeButton from "./LikeButton";
import CommentSection from "./CommentSection";
import { FiMessageCircle, FiUser, FiArrowRight } from "react-icons/fi";

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
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 mb-6 relative group">
            {/* Author Badge */}
            <div className="flex items-center mb-4 text-gray-600">
                <FiUser className="mr-2" />
                <span className="font-medium bg-gray-100 px-3 py-1 rounded-full text-sm">
                    {post.author}
                </span>
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold text-gray-800 mb-3">{post.title}</h3>

            {/* Description */}
            <div className="mb-6">
                <p className="text-gray-600 leading-relaxed">
                    {post.body.substring(0, 100)}
                    <Link 
                        to={`blog/${post._id}`}
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium ml-2 transition-colors"
                    >
                        Continue reading
                        <FiArrowRight className="ml-1" />
                    </Link>
                </p>
            </div>

            {/* Interaction Bar */}
            <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <LikeButton 
                        isAuthenticated={isAuthenticated} 
                        isLiked={isLiked} 
                        handleLike={handleLike} 
                    />
                    <span className="text-gray-600 mr-1 font-medium">{countLike}</span>
                    <p></p>
                    
                    {/* <button 
                        onClick={showComments}
                        className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
                    >
                        <FiMessageCircle className="mr-2" />
                        <span className="font-medium">{countComment}</span>
                    </button> */}
                </div>

                <CommentSection 
                    showComments={showComments} 
                    comment={comment} 
                    setComment={setComment} 
                    handleComment={handleComment} 
                />
                <span className="ml-2 font-medium">{countComment}</span>
            </div>

            {/* Comments Modal */}
            {isOpen && allComments && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[80vh] overflow-hidden">
                        <CommentDetails 
                            comments={allComments} 
                            setCloseModal={setCloseModal} 
                            setIsOpen={setIsOpen} 
                            closeModal={closeModal} 
                            fetchcomments={fetchcomments} 
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default Card;