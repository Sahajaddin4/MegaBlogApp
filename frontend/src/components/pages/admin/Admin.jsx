import React, { useCallback, useContext, useEffect, useState } from 'react';
import UserLists from './UserLists';
import { BlogContext } from '../../../contextApi/BlogContextApi';
import { UserContext } from '../../../contextApi/userAuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Spinner from '../spinner/Spinner';
import axios from 'axios';
import Card from '../card/Card';
import { toast } from 'react-toastify';

function Admin() {
  // Destructuring necessary data and functions from BlogContext and UserContext
  const { posts, loader, setLoader, toastStyle, getAllBlogPosts,rejectedPosts,pendingPosts } = useContext(BlogContext);
  const { isAuthenticated } = useContext(UserContext);
  
  // Local states for managing users, posts, and UI logic
  const [users, setUsers] = useState([]);
  const [pending, setPending] = useState(false);
  const [showUsers, setShowUsers] = useState(true);
  const [showPost, setShowPost] = useState(false);
  
  const navigate = useNavigate();

  // Function to fetch the list of users
  const getUserList = useCallback(async () => {
    try {
      let res = await axios.get('/api/blog/api/user/get-users');
      setUsers(res.data.userLists); // Set users from the response
      setLoader(false); // Set loader state to false once data is fetched
    } catch (error) {
      console.log('Server error');
    }
  },[setLoader]);




  // // Function to handle the post Rejected
  const postRejected = async (postId) => {
    let res = await axios.put(`/api/blog/api/blog-rejected/${postId}`);
    if (res) {
      fetchPosts();
      toast.success("Post Rejected", toastStyle); // Show success toast
    } else {
      toast.error("Server error!", toastStyle); // Show error toast if server fails
    }
  };
  // Function to handle the post approval
  const postApproved = async (postId) => {
    let res = await axios.put(`/api/blog/api/blog-approved/${postId}`);
    if (res) {
      fetchPosts();
      toast.success("Post approved", toastStyle); // Show success toast
    } else {
      toast.error("Server error!", toastStyle); // Show error toast if server fails
    }
  };

  // Function to render different content based on the selected view (Users, Posts, Pending Approval)
  const renderContent = () => {
    if (showUsers) {
      return users.length > 0 ? (
        <UserLists users={users} />
      ) : (
        'No user found'
      );
    }

    if (showPost) {
      return posts.length > 0 ? (
        posts.map((post) => <div key={post._id} className='mb-2'><Card  post={post} /></div>)
      ) : (
        'No posts available'
      );
    }

    if (pending) {
      return pendingPosts.length > 0 ? (
        pendingPosts.map((post) => (
          <div key={post._id} className='flex gap-2 '>
            <div className="card w-full mb-2 "> <Card post={post} /></div>
            <div className="button flex flex-col mb-2 justify-between ">
              {/* Approve and Reject buttons for each pending post */}
              <button onClick={() => { postApproved(post._id) }} className='bg-green-600 rounded py-1 px-2'>Approve</button>
              <button onClick={() => {postRejected(post._id) }} className='bg-red-600 rounded py-1 px-2'>Reject</button>
            </div>
          </div>
        ))
      ) : (
        'No pending posts' // Message when there are no posts pending approval
      );
    }

    return null; // Default return if none of the conditions are met
  };

  // useEffect to check if the user is authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/user/login'); // If not authenticated, redirect to login page
    }
    
    
    getUserList();
  }, [isAuthenticated]);

 const fetchPosts=async()=>{
   
  await getAllBlogPosts();
 setLoader(false);
 }



 const fetchpendingPosts=()=>{
  setLoader(true);
  fetchPosts();
  setLoader(false);
  setShowUsers(false); // Hide users list
  setShowPost(false); // Hide posts
  setPending(true); // Show pending posts
 }
  return (
    <>
      {loader ? (
        <Spinner /> // Show a loading spinner while data is being fetched
      ) : (
        <div className="flex gap-20 mt-10">
          {/* Left Sidebar */}
          <div className="leftSlidebar flex flex-col gap-2 pr-5 border-r-2">
            <div className="adminDetails"></div>
            <div className="adminControler flex flex-col ">
              {/* Button to add a new user */}
              <button className="userAdd cursor-pointer">
                <Link to="/user/signup">Add User</Link>
              </button>
              {/* Button to show the list of users */}
              <button
                className="userList cursor-pointer"
                onClick={() => {
                  getUserList();
                  setShowPost(false); // Hide posts
                  setPending(false); // Hide pending posts
                  setShowUsers(true); // Show users list
                }}
              >
                Users
              </button>
              {/* Button to show the list of posts */}
              <button
                onClick={() => {
                  getAllBlogPosts(); // Fetch all blog posts
                  setShowUsers(false); // Hide users list
                  setPending(false); // Hide pending posts
                  setShowPost(true); // Show posts
                }}
                className="posts"
              >
                Posts
              </button>
              {/* Button to show posts pending approval */}
              <div className="pending-approval">
                <button
                  onClick={
                    fetchpendingPosts
                  }
                >
                  Pending Approval
                </button>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Displays the actual content based on state */}
          <div className="rightSlidebar grow">
            {renderContent()} {/* Renders the content (users, posts, or pending approval) */}
          </div>
        </div>
      )}
    </>
  );
}

export default Admin;
