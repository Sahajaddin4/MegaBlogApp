import React, { useContext, useEffect } from 'react'
import Card from '../card/Card'
import { BlogContext } from '../../../contextApi/BlogContextApi'
import axios from 'axios';
import { toast } from 'react-toastify'; // Ensure you have this import
import { Link } from 'react-router-dom';
function RejecetedPosts() {

  const {rejectedPosts, getRejected, setCachedPosts,setRejectedPosts, rejectedState, toastStyle}=useContext(BlogContext);
   
  // Approve rejected posts
  const approveRejectedPosts = async (postId) => {
    try {
      const res = await axios.put(`/api/blog/api/rejected-blog-approve/${postId}`);
      
      if (res.status === 200) {
        // Remove the post from rejectedPosts state after approving it
        setRejectedPosts((prevState) => {
          return prevState.filter(post => post._id !== postId);
        });
        setCachedPosts((prev)=>{
          let newCache={...prev};
          let pageKey=`rejected_${rejectedState.page}`;
          return newCache[pageKey].data.filter(post=>post._id!==postId);
        });
        toast.success('Approved rejected post', toastStyle);
      } else {
        toast.error('Error approving rejected post', toastStyle);
      }
    } catch (error) {
      console.log('Server error', error);
      toast.error('Error with server!', toastStyle);
    }
  };

  useEffect(()=>{
    getRejected();
  },[rejectedState.page]);

  return (
   <div className='flex-col mt-12 max-w-[80%] mx-auto '>
    {/* "Back" button with a link */}
          <Link to="/admin">
            <button className='bg-blue-400 text-white mb-5 hover:text-blue-500 hover:bg-white py-2 px-4 rounded'>
              Back
            </button>
          </Link>
     <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
         { rejectedPosts.length>0?
          rejectedPosts.map((post) => (
          <div key={post._id} className='flex gap-2 '>
            <div className="card w-full mb-2 "> <Card post={post} /></div>
            <div className="button flex flex-col mb-2 justify-between ">
              {/* Approve and Reject buttons for each pending post */}
              <button onClick={() => { approveRejectedPosts(post._id) }} className='bg-green-600 rounded py-1 px-2'>Approve</button>
            </div>
          </div>
        ))
      :<p>No rejected posts.</p>}
    </div>
   </div>
  )
}

export default RejecetedPosts