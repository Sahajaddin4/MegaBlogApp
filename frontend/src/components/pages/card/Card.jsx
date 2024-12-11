import React, { useContext, useEffect, useState } from "react";
import { BlogContext } from "../../../contextApi/BlogContextApi";
import axios from "axios";
import { UserContext } from "../../../contextApi/userAuthContext";
import { toast } from "react-toastify";
import CommentDetails from "./CommentDetails";

function Card({ post }) {
  // Access the current user's authentication context
  const { isAuthenticated, user, userId } = useContext(UserContext);

  // State management
  const [isLiked, setIsLiked] = useState(false); // Track if the post is liked
  const [countLike, setCountLike] = useState(post.likes.length); // Like count
  const [isExpanded, setIsExpanded] = useState(false); // Track if the post description is expanded
  const [truncatedPost, setTruncatedPost] = useState(); // Truncated version of the post
  const [comment, setComment] = useState(""); // Comment input state
  const [loading, setLoading] = useState(false); // Track if like request is in progress

  const [allComments, setAllComments] = useState([]); // Store all comments for a post
  const [countComment, setCountComment] = useState(post.comments.length); // Comment count
  const [isOpen, setIsOpen] = useState(false); // Track if comments modal is open
  const [closeModal, setCloseModal] = useState(true); // Modal close state
   
  // Caching likes and comments count in memory (local state)
  
  const [cachedComments, setCachedComments] = useState(null);

  // Get the toast style from BlogContext
  const { toastStyle } = useContext(BlogContext);

  // Toggle the post description between truncated and full
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Truncate the post description to 100 characters if not expanded
  const truncateDesc = () => {
    if (post && !isExpanded) {
      setTruncatedPost(post.body.substring(0, 100));
    }
  };

  // Handle the like action
  const handleLike = async () => {
    // Prevent double clicking if a request is in progress
    if (loading) return;

    const data = {
      author: user,
      postId: post._id,
    };

    setLoading(true); // Set loading state to true before making the request

    try {
      if (isLiked) {
        // Unlike the post
        const res = await axios.delete("/api/blog/api/like-dislike/post-dislike", { params: data });
        setIsLiked(res.data.isLiked); // Update the liked state
        setCountLike(countLike-1);
       
      } else {
        // Like the post
        const res = await axios.post("/api/blog/api/like-dislike/post-like", data);
        setIsLiked(res.data.isLiked); // Update the liked state
        setCountLike(countLike+1);
        
      }
    } catch (error) {
      toast.error("Failed to like the post", toastStyle); // Handle error
    } finally {
      setLoading(false); // Set loading state back to false after the request completes
    }
  };

 
  // Run these functions on component mount
  useEffect(() => {
    getLike(post._id, user); // Check if the post is liked by the user
   
  }, []);

  // Fetch like status for a post
  async function getLike(post, author) {
    const data = { post, author };
    let res = await axios.get("/api/blog/api/like-dislike/get-like", { params: data });
    setIsLiked(res.data.isLiked); // Update liked state based on response
  }

  // Truncate description when not expanded
  useEffect(() => {
    truncateDesc();
  }, [isExpanded]);

  // -------------------------- Comments -----------------------------

  // Handle comment submission
  const handleComment = async () => {
    if (comment === "") {
      toast.warn("Enter Comment", toastStyle);
      return;
    }
    const data = {
      author: user,
      userId: userId,
      postId: post._id,
      comment: comment,
    };

    try {
      // Add comment
      const res = await axios.post("/api/blog/api/comment/add-comment", data);
      toast.success(res.data.message, toastStyle);
      setCountComment(countComment+1); // Update comment count
      setCachedComments(null); // Invalidate cache after adding a new comment
    } catch (error) {
      toast.error("Server error!", toastStyle); // Handle error
    } finally {
      setComment(""); // Reset comment input
    }
  };

  // Fetch all comments for a post with caching
  async function fetchcomments() {
    if (cachedComments !== null) {
      setAllComments(cachedComments); // Use cached comments if available
      return;
    }

    const postDetails = { postId: post._id };
    let res = await axios.get("/api/blog/api/comment/get-all-comments", { params: postDetails });
    setAllComments(res.data.comments); // Update all comments
    setCachedComments(res.data.comments); // Cache the comments in memory
  }

  const showComments = async () => {
    await fetchcomments();
    setIsOpen(true);
    setCloseModal(false);
  };



  return (
    <div className="p-4 flex flex-col gap-3 bg-blue-100 rounded shadow-md">
      {/* Title and Author section */}
      <div className="title-author flex justify-between">
        <div className="title flex gap-2">
          <h1 className="text-xl font-bold">Title:</h1>
          <p>{post.title}</p>
        </div>
        <div className="author flex gap-3 justify-center items-center">
          <p className="font-medium">By</p>
          <span className="text-sm italic">{post.author}</span>
        </div>
      </div>

      {/* Description section */}
      <div className="body flex gap-2">
        <h1 className="text-lg font-semibold">Description:</h1>
        {!isExpanded ? (
          <p>
            {truncatedPost}
            <span
              onClick={toggleExpand}
              className="hover:cursor-pointer italic text-green-400 ml-5"
            >
              .read more..
            </span>
          </p>
        ) : (
          <p> 
            {post.body}
            <span
              onClick={toggleExpand}
              className="ml-5 italic hover:cursor-pointer text-red-400"
            >
              shrink post
            </span>
          </p>
        )}
      </div>

      {/* Like and Comment section */}
      <div className="last-section flex justify-between">
        {/* Like section */}
        <div className="like-dislike">
          {isAuthenticated ? (
            isLiked ? (
              <i
                className="fa-regular fa-heart text-red-500 hover:cursor-pointer"
                onClick={handleLike}
                role="button"
              ></i>
            ) : (
              <i
                className="fa-regular fa-heart hover:cursor-pointer"
                onClick={handleLike}
              ></i>
            )
          ) : (
            <i className="fa-regular fa-heart hover:cursor-not-allowed"></i>
          )}
          <span className="ml-1">{countLike}</span>
        </div>

        {/* Comment section */}
        <div className="comments flex gap-2 items-center">
          <input
            type="text"
            name="comment"
            id="comment"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
            className="rounded hover:border hover:border-blue-400"
          />
          <span>
            <button
              onClick={handleComment}
              className="py-2 px-4 bg-green-400 text-white rounded-md"
            >
              add
            </button>
          </span>
          <span>
            <i
              onClick={showComments}
              className="fa-regular fa-comment hover:cursor-pointer"
            ></i>
            <span className="mx-1">{countComment}</span>
          </span>

          {/* Modals for showing comments */}
          {isOpen && allComments ? (
            <div className={`comments-show`}>
              <CommentDetails
                comments={allComments}
                setCloseModal={setCloseModal}
                setIsOpen={setIsOpen}
                closeModal={closeModal}
                fetchcomments={fetchcomments}
              />
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}

export default Card;