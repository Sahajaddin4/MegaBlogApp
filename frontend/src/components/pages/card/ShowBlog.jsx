import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CommentDetails from './CommentDetails';
import { BlogContext } from '../../../contextApi/BlogContextApi';
import { UserContext } from '../../../contextApi/userAuthContext';
import Spinner from '../spinner/Spinner';
import axios from 'axios';
import { toast } from 'react-toastify';

function ShowBlog() {
  // Sample data - You would probably fetch this from an API
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
    {
      !post?<Spinner/>:(
       <div className='mt-10'>
        <button className='bg-blue-600 hover:bg-white hover:text-blue-500 px-2 py-1 rounded text-white' onClick={handleBackButton}>Back</button>
         <div className="w-full mt-5 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700 p-4 flex flex-col">
      {/* Title and Author section */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-2xl font-semibold text-gray-900 dark:text-white">{post.title}</p>
        <div className="text-sm text-gray-500 dark:text-gray-400">By {post.author}</div>
      </div>

      {/* Description section */}
      <div className="flex-grow mb-4">
        <h1 className="text-xl font-medium text-gray-700 dark:text-gray-400">Description:</h1>
       
          <p className="text-gray-600 dark:text-gray-300">
            {post.body}
           
          </p>
       
      </div>

      {/* Like and Comment section at the bottom */}
      <div className="flex md:flex-row sm:flex-col justify-between items-center mt-4">
        {/* Like section */}
        <div className="flex items-center gap-2 mb-3 sm:mb-0">
          {isAuthenticated ? (
            isLiked ? (
              <i
                className="fa-regular fa-heart text-red-500 hover:cursor-pointer text-xl"
                onClick={handleLike}
                role="button"
              ></i>
            ) : (
              <i
                className="fa-regular fa-heart hover:cursor-pointer text-xl"
                onClick={handleLike}
              ></i>
            )
          ) : (
            <i className="fa-regular fa-heart text-gray-500"></i>
          )}
          <span className="ml-1 text-gray-600 dark:text-gray-300">{countLike}</span>
        </div>

        {/* Comment section */}
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="px-3 py-2 border rounded-md w-full sm:w-36 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
          <button
            onClick={handleComment}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            Add
          </button>
          <button
            onClick={showComments}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <i className="fa-regular fa-comment text-lg"></i>
            <span>{countComment}</span>
          </button>
        </div>
      </div>

      {/* Comments Modal */}
      {isOpen && allComments && (
        <div className="fixed inset-2 bg-gray-800 bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
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
      
       </div>)
    }
    </>
  );
}

export default ShowBlog;
