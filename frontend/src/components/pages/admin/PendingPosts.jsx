import React, { useContext, useEffect } from 'react';
import Card from '../card/Card';
import { BlogContext } from '../../../contextApi/BlogContextApi';
import axios from 'axios';
import { toast } from 'react-toastify'; // Ensure you have this import
import { Link } from 'react-router-dom';

function PendingPosts() {
  const { pendingPosts, setPendingPosts, getPending, setCachedPosts, pendingState, rejectedState, toastStyle } = useContext(BlogContext);

  // Reject post
  const postRejected = async (postId) => {
    try {
      let res = await axios.put(`/api/blog/api/blog-rejected/${postId}`);
      if (res) {
        setCachedPosts((prev) => {
          let newCache = { ...prev };
          let pendingPageKey = `pending_${pendingState.page}`;
          let rejectedPageKey = `rejected_${rejectedState.page}`;
          const approvedPost = newCache[pendingPageKey]?.data.find(post => post._id === postId);

          if (approvedPost) {
            if (!newCache[rejectedPageKey]) {
              newCache[rejectedPageKey] = { data: [] };
            }
            newCache[rejectedPageKey].data.push(approvedPost);

            // Ensure the pending page data exists before trying to filter
            if (newCache[pendingPageKey]?.data) {
              newCache[pendingPageKey].data = newCache[pendingPageKey].data.filter(post => post._id !== postId);
            }
          }

          return newCache;
        });

        setPendingPosts(prevState => prevState.filter(post => post._id !== postId));
        toast.success('Post rejected', toastStyle);
      }
    } catch (error) {
      toast.error('Server error!', toastStyle);
    }
  };

  // Approve post
  const postApproved = async (postId) => {
    try {
      let res = await axios.put(`/api/blog/api/blog-approved/${postId}`);
      if (res.status === 200) {
        
        setCachedPosts((prev) => {
          let newCache = { ...prev };
          let pageKey = `pending_${pendingState.page}`;

          // Ensure the page exists and data is not undefined before filtering
          if (newCache[pageKey]?.data) {
            newCache[pageKey].data = newCache[pageKey].data.filter(post => post._id !== postId);
          }

          return newCache;
        });
        setPendingPosts(prevState => prevState.filter(post => post._id !== postId));
        toast.success('Post approved', toastStyle);
      }
    } catch (error) {
      toast.error('Server error!', toastStyle);
    }
  };

  useEffect(() => {
    getPending();
  }, [pendingState.page]);

  

  return (
    <div className='flex-col mt-12 max-w-[80%] mx-auto'>
      {/* "Back" button with a link */}
      <Link to="/admin">
        <button className='bg-blue-400 text-white hover:text-blue-500 hover:bg-white py-2 px-4 rounded'>
          Back
        </button>
      </Link>

      {/* Display the list of pending posts */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mt-5'>
        {pendingPosts.length>0?pendingPosts.map((post) => (
          <div key={post._id} className='flex gap-2'>
            <div className="card w-full mb-2"><Card post={post} /></div>
            <div className="button flex flex-col mb-2 justify-between">
              {/* Approve and Reject buttons for each pending post */}
              <button onClick={() => postApproved(post._id)} className='bg-green-600 rounded py-1 px-2'>
                Approve
              </button>
              <button onClick={() => postRejected(post._id)} className='bg-red-600 rounded py-1 px-2'>
                Reject
              </button>
            </div>
          </div>
        )):<p>No pending posts available.</p>}
      </div>
    </div>
  );
}

export default PendingPosts;
