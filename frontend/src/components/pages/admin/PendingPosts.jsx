import React, { useContext, useEffect } from 'react';
import Card from '../card/Card';
import { BlogContext } from '../../../contextApi/BlogContextApi';
import axios from 'axios';
import { toast } from 'react-toastify'; // Ensure you have this import
import { Link } from 'react-router-dom';
import Pagination from './Pagination';

function PendingPosts() {
  const { pendingPosts, setPendingPosts, getPending, setCachedPosts, pendingState, cachedPosts, setPendingState, toastStyle } = useContext(BlogContext);

  // Reject post
  const postRejected = async (postId) => {
    try {
      // Send the rejection request to the server
      let res = await axios.put(`/api/blog/api/blog-rejected/${postId}`);
      if (res.status === 200) {
        //Update the cache after rejection
        setCachedPosts((prev) => {
          let newCache = { ...prev ,rejectedPostsCache:{}};

          // Cache keys for the current pending and rejected pages
          const pendingPageKey = `pending_${pendingState.page}`;
         
          if(newCache[pendingPageKey]!==undefined)
          {
            newCache[pendingPageKey].data = newCache[pendingPageKey].data?.filter(post => post._id !== postId);
          }
          return newCache; // Return the updated cache
        });
     
        // Update the state of pending posts to remove the rejected post
        setPendingPosts(prevState => prevState.filter(post => post._id !== postId));

        // Show success toast message
        toast.success('Post rejected', toastStyle);
      } else {
        // Handle server response that is not successful
        toast.error('Error rejecting post', toastStyle);
      }
    } catch (error) {
      // Handle any errors during the request
      console.log('Error rejecting post', error);
      toast.error('Server error!', toastStyle);
    }
  };

  // Approve post
  const postApproved = async (postId) => {
    try {
      // Send the approval request to the server
      let res = await axios.put(`/api/blog/api/blog-approved/${postId}`);
      if (res.status === 200) {
        // Update the cache after approval
        // setCachedPosts((prev) => {
        //   let newCache = { ...prev };
        //   const pageKey = `pending_${pendingState.page}`;

        //   // Ensure the page exists and data is not undefined before filtering
        //   if (newCache[pageKey]?.data) {
        //     newCache[pageKey].data = newCache[pageKey].data.filter(post => post._id !== postId);
        //   }
         
        //   return newCache;
        // });
           setCachedPosts(prev=>({
            ...prev,
            pendingPostsCache: {}
           }))
        // Update the state of pending posts to remove the approved post
        setPendingPosts(prevState => prevState.filter(post => post._id !== postId));

        // Show success toast message
        toast.success('Post approved', toastStyle);
      } else {
        // Handle error if approval fails
        toast.error('Error approving post', toastStyle);
      }
    } catch (error) {
      // Handle any errors during the approval request
      console.log('Error approving post', error);
      toast.error('Server error!', toastStyle);
    }
  };

  // Fetch pending posts when the page changes
  useEffect(() => {
    getPending();
  }, [pendingState.page,cachedPosts]);

  return (
    <div className='flex-col mt-6 max-w-[80%] mx-auto'>
      {/* "Back" button with a link */}
      <Link to="/admin">
        <button className='bg-blue-400 text-white hover:text-blue-500 hover:bg-white py-2 px-4 rounded'>
          Back
        </button>
      </Link>

      {/* Display the list of pending posts */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mt-5 overflow-y-scroll h-[70vh]'>
        {pendingPosts.length > 0 ? (
          pendingPosts.map((post) => (
            <div key={post._id} className='flex gap-2 max-h-[35vh]'>
              <div className="card w-full mb-2">
                <Card post={post} />
              </div>
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
          ))
        ) : (
          <p>No pending posts available.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="pagination fixed bottom-0 mb-3">
        <Pagination
          totalPages={pendingState.totalPage}
          currentPage={pendingState.page}
          setCurrentState={setPendingState}
        />
      </div>
    </div>
  );
}

export default PendingPosts;
