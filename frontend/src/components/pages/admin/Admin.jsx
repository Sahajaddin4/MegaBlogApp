import React, { useCallback, useContext, useEffect, useState } from 'react';
import UserLists from './UserLists';
import { BlogContext } from '../../../contextApi/BlogContextApi';
import { UserContext } from '../../../contextApi/userAuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Spinner from '../spinner/Spinner';
import axios from 'axios';
import { toast } from 'react-toastify';
import PendingPosts from './PendingPosts';
import RejecetedPosts from './RejecetedPosts';


function Admin() {
  // Destructuring necessary data and functions from BlogContext and UserContext
  const { loader, setLoader, toastStyle,setPendingPosts,setRejecetedPosts,posts, getAllBlogPosts, rejectedPosts, pendingPosts } = useContext(BlogContext);
  const { isAuthenticated, userType } = useContext(UserContext);
  
  // Single state object to manage all UI states
  const [state, setState] = useState({
    users: [],
    pending: false,
    showUsers: true,
    rejected: false
  });
  
  const navigate = useNavigate();

  // Active user account
  const activeUserAc = async (userId) => {
    try {
      setLoader(true);
      let res = await axios.put(`/api/blog/api/user/active-user/${userId}`);
      if (res) {
        setState(prevState=>({
          ...prevState,
          users:prevState.users.map((user)=>user._id===userId?{...user,status:"active"}:user)
        }))
        toast.success('User account activated successfully', toastStyle);
      } else {
        toast.error('Error activating user!');
      }
      setLoader(false);
    } catch (error) {
      console.log('Server error');
    }
  };

  // Remove user
  const removeUser = async (userId) => {
    try {
      let res = await axios.delete(`/api/blog/api/user/delete-user/${userId}`);
      if (res) {
        setState(prevState=>({
          ...prevState,
          users:prevState.users.map((user)=>user._id===userId?{...user,status:"inactive"}:user)
        }));
        toast.success('User removed successfully', toastStyle);
      } else {
        toast.error('Error removing user!');
      }
      setLoader(false);
    } catch (error) {
      console.log('Server error');
    }
  };

  // Fetch user list
  const getUserList = useCallback(async () => {
    try {
      let res = await axios.get('/api/blog/api/user/get-users');
      setState(prevState => ({
        ...prevState,
        users: res.data.userLists
      }));
      setLoader(false);
    } catch (error) {
      console.log('Server error');
    }
  }, []);

  // Approve rejected posts
  const approveRejectedPosts = async (postId) => {
    let res = await axios.put(`/api/blog/api/rejected-blog-approve/${postId}`);
    if (res.status===200) {
      setRejecetedPosts(prevState=>{
        return prevState.filter(post=>post._id!==postId);
      });
     
      toast.success('Approved rejected post', toastStyle);
    } else {
      toast.error('Server error!', toastStyle);
    }
  };

  // Reject post
  const postRejected = async (postId) => {
    let res = await axios.put(`/api/blog/api/blog-rejected/${postId}`);
    if (res) {
     
      setRejecetedPosts(()=>{
        return posts.map(post=>post._id===postId?{...post,status:"rejected"}:post)
      });
      setPendingPosts(prevState=>{
        return prevState.filter(post=>post._id!==postId);
      });
      toast.success('Post rejected', toastStyle);
    } else {
      toast.error('Server error!', toastStyle);
    }
  };

  // Approve post
  const postApproved = async (postId) => {
    let res = await axios.put(`/api/blog/api/blog-approved/${postId}`);
    if (res.status===200) {
        
      setPendingPosts(prevState=>{
        return prevState.filter((post)=>post._id!==postId)
      })
      toast.success('Post approved', toastStyle);
     
    } else {
      toast.error('Server error!', toastStyle);
    }
  };

  // Fetch posts
  const fetchPosts = async (currentPage) => {
    await getAllBlogPosts(currentPage);
  };

  // Fetch pending posts
  const fetchpendingPosts = () => {
    fetchPosts();
    setState(prevState => ({
      ...prevState,
      rejected: false,
      showUsers: false,
      pending: true
    }));
  };

  // Fetch rejected posts
  const fetchRejectedPosts = () => {
    fetchPosts();
    setState(prevState => ({
      ...prevState,
      showUsers: false,
      pending: false,
      rejected: true
    }));
  };

  // Render content based on the current state
  const renderContent = () => {
    if (state.showUsers) {
      return state.users.length > 0 ? (
        <UserLists removeUser={removeUser} activeUserAc={activeUserAc} users={state.users} />
      ) : (
        'No user found'
      );
    }

    if (state.pending) {
      return pendingPosts.length > 0 ? (
        <PendingPosts postApproved={postApproved} postRejected={postRejected} posts={pendingPosts} />
      ) : (
        'No pending posts'
      );
    }

    if (state.rejected) {
      return rejectedPosts.length > 0 ? (
        <RejecetedPosts approveRejectedPosts={approveRejectedPosts} posts={rejectedPosts} />
      ) : (
        'No rejected posts.'
      );
    }

    return null;
  };
function allUsers()  {
 
  setState(prevState => ({
    ...prevState,
    rejected: false,
    pending: false,
    showUsers: true
  }));
}
  // useEffect to check if the user is authenticated
  useEffect(() => {
    if (!isAuthenticated && userType !== 'admin') {
      navigate('/user/login');
    }

    getUserList();
  }, [isAuthenticated]);

  return (
    <>
      {loader ? (
        <Spinner />
      ) : (
        <div className="flex gap-10 mt-10 overflow-hidden ">
          {/* Left Sidebar */}
          <div className="leftSlidebar overflow-hidden max-h-[100vh] min-w-[200px] justify-start flex flex-col gap-2 pr-5 border-r-2">
            <div className="adminDetails"></div>
            <div className="adminControler flex flex-col ">
              {/* Button to add a new user */}
              <div>
                <button className="userAdd cursor-pointer">
                  <Link to="/user/signup">Add User</Link>
                </button>
              </div>

              {/* Button to show the list of users */}
              <div>
                <button
                  className="userList cursor-pointer"
                  onClick={
                    allUsers
                  }
                >
                  Users
                </button>
              </div>

              {/* Button to show posts pending approval */}
              <div className="pending-approval">
                <button onClick={fetchpendingPosts}>Pending Approvals</button>
              </div>

              {/* Rejected lists */}
              <div className="rejected-approval">
                <button onClick={fetchRejectedPosts}>Rejected Posts</button>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Displays the actual content based on state */}
          <div className="rightSlidebar grow ">
            {renderContent()}
          </div>
        </div>
      )}
    </>
  );
}

export default Admin;
