import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CommentDetails from './CommentDetails';
import { BlogContext } from '../../../contextApi/BlogContextApi';
import { UserContext } from '../../../contextApi/UserAuthContext';
import Spinner from '../spinner/Spinner';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function ShowBlog() {
  const { id } = useParams(); // Get the postId from the URL
// State management
const [isLiked, setIsLiked] = useState(false); 
const [countLike, setCountLike] = useState(0);

const [comment, setComment] = useState(""); 
const [loading, setLoading] = useState(false); 

const [allComments, setAllComments] = useState([]); 
const [countComment, setCountComment] = useState(0);
const [isOpen, setIsOpen] = useState(false); 
const [closeModal, setCloseModal] = useState(true); 

const [cachedComments, setCachedComments] = useState(null);
const navigate=useNavigate();
const { toastStyle ,setLoader} = useContext(BlogContext);
  const [post,setPost]=useState();
  // Sample blog data based on postId
  const getMyBlog=async()=>{
    try {
        setLoader(true)
       let res= await axios.get(`/api/blog/api/get-blog/${id}`);
      
       if(res){
 
        setPost(res.data.blog);
         setCountComment(res.data.blog.comments.length);
         setCountLike(res.data.blog.likes.length);  
       }
       
    } catch (error) {
       console.log(error);
       
    }
     setLoader(false);
 }
 const { isAuthenticated, user, userId } = useContext(UserContext);

  
  const handleLike = async () => {
    if (loading) return;

    const data = { author: user, postId: id };

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
    if(isAuthenticated)
        {
            getLike(id, user);

        } 
      getMyBlog();
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

    const data = { author: user, userId: userId, postId: id, comment: comment };

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

    const postDetails = { postId: id };
    let res = await axios.get("/api/blog/api/comment/get-all-comments", { params: postDetails });
    setAllComments(res.data.comments);
    setCachedComments(res.data.comments);
    
  }

  const showComments = async () => {
    await fetchcomments();
    setIsOpen(true);
    setCloseModal(false);
  };

  function handleBackButton()
  {
   navigate(-1);
  }

  return (
    <>
      {!post ? (
        <Spinner />
      ) : (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <button 
              onClick={handleBackButton}
              className="mb-8 flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors"
            >
              <i className="fa-solid fa-arrow-left mr-2"></i>
              Back to Posts
            </button>

            <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
              {/* Header Section */}
              <div className="p-8 border-b border-gray-100 dark:border-gray-700">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                  {post.title}
                </h1>
                <div className="flex items-center text-gray-500 dark:text-gray-400">
                  <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
                    {post.author}
                  </span>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-8 prose dark:prose-invert max-w-none">
                <p className="text-gray-600 dark:text-gray-300 leading-7">
                  {post.body}
                </p>
              </div>

              {/* Interaction Section */}
              <div className="p-8 border-t border-gray-100 dark:border-gray-700">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  {/* Like Button */}
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleLike}
                      disabled={!isAuthenticated}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                        isLiked 
                          ? 'text-red-500 bg-red-50 dark:bg-red-900/20'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <i className={`fa-heart text-xl ${
                        isLiked ? 'fa-solid' : 'fa-regular'
                      }`}></i>
                      <span className="font-medium">{countLike}</span>
                    </button>
                  </div>

                  {/* Comment Section */}
                  <div className="flex flex-1 items-center gap-4 max-w-xl">
                    <input
                      type="text"
                      placeholder="Share your thoughts..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="flex-1 px-4 py-2 border dark:border-gray-700 rounded-full bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleComment}
                      className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:shadow-lg transition-shadow"
                    >
                      Post
                    </button>
                    <button
                      onClick={showComments}
                      className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <i className="fa-regular fa-comment-dots text-xl"></i>
                      <span className="font-medium">{countComment}</span>
                    </button>
                  </div>
                </div>
              </div>
            </article>

            {/* Comments Modal */}
            {isOpen && allComments && (
              <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
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
        </div>
      )}
    </>
  );
}