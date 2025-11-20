import React, { useCallback, useContext, useEffect, useState } from 'react';
import UserLists from './UserLists';
import { BlogContext } from '../../../contextApi/BlogContextApi';
import { UserContext } from '../../../contextApi/UserAuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Spinner from '../spinner/Spinner';
import axios from 'axios';
import { toast } from 'react-toastify';
import PendingPosts from './PendingPosts';
import RejecetedPosts from './RejecetedPosts';
import PaginationNumber from './Pagination';
// import io from 'socket.io-client';
import { NotificationContext } from '../../../contextApi/NotificationContextApi';

function Admin() {
  // Destructuring necessary data and functions from BlogContext and UserContext
  const { loader, setLoader, toastStyle, setCachedPosts, setPendingPosts, setRejectedPosts, pendingState, setRejectedState, rejectedState, getRejected, getPending, setPendingState, rejectedPosts, pendingPosts } = useContext(BlogContext);
  const { isAuthenticated, userType,socket } = useContext(UserContext);
  const { getAdminNotification } = useContext(NotificationContext);
  const [state, setState] = useState({
    users: [],
    pending: false,
    showUsers: true,
    rejected: false
  });

  // const socket = io(`http://localhost:3000`);
  
  // socket.on('connect', () => {
  //   console.log('connected to socket server');
  // });
  
  socket.on('newBlog', async () => {
    console.log("newBlog")
    await getAdminNotification();
  });

  const navigate = useNavigate();

  // Active user account
  const activeUserAc = async (userId) => {
    try {
      setLoader(true);
      let res = await axios.put(`/api/blog/api/user/active-user/${userId}`);
      if (res) {
        setState(prevState => ({
          ...prevState,
          users: prevState.users.map((user) => user._id === userId ? { ...user, status: "active" } : user)
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
        setState(prevState => ({
          ...prevState,
          users: prevState.users.map((user) => user._id === userId ? { ...user, status: "inactive" } : user)
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
    try {
      const res = await axios.put(`/api/blog/api/rejected-blog-approve/${postId}`);
      
      if (res.status === 200) {
        setRejectedPosts((prevState) => {
          return prevState.filter(post => post._id !== postId);
        });
        setCachedPosts((prev) => {
          let newCache = { ...prev };
          let pageKey = `rejected_${rejectedState.page}`;
          return newCache[pageKey].data.filter(post => post._id !== postId);
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

  // Reject post
  const postRejected = async (postId) => {
    let res = await axios.put(`/api/blog/api/blog-rejected/${postId}`);
    if (res) {
      getAdminNotification();
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
          newCache[pendingPageKey].data = newCache[pendingPageKey].data.filter(post => post._id !== postId);
        }
      
        return newCache;
      });
      
      setPendingPosts(prevState => {
        return prevState.filter(post => post._id !== postId);
      });
      toast.success('Post rejected', toastStyle);
    } else {
      toast.error('Server error!', toastStyle);
    }
  };

  // Approve post
  const postApproved = async (postId) => {
    let res = await axios.put(`/api/blog/api/blog-approved/${postId}`);
    if (res.status === 200) {
      socket.emit("postApproved",`You post has been Approved`);
      getAdminNotification(); 
      setPendingPosts(prevState => {
        return prevState.filter((post) => post._id !== postId)
      })
      setCachedPosts((prev) => {
        let newCache = { ...prev };
        let pageKey = `pending-${pendingState.page}`;
        return newCache[pageKey].data.filter(post => post._id !== postId);
      });
      toast.success('Post approved', toastStyle);
    } else {
      toast.error('Server error!', toastStyle);
    }
  };

  // Fetch pending posts
  const fetchpendingPosts = useCallback(() => {
    getPending();
    setState(prevState => ({
      ...prevState,
      rejected: false,
      showUsers: false,
      pending: true
    }));
  }, [pendingState.page]);

  // Fetch rejected posts
  const fetchRejectedPosts = useCallback(() => {
    getRejected();
    setState(prevState => ({
      ...prevState,
      showUsers: false,
      pending: false,
      rejected: true
    }));
  }, [rejectedState.page]);

  // Render content based on the current state
  const renderContent = () => {
    if (state.showUsers) {
      return state.users.length > 0 ? (
        <UserLists removeUser={removeUser} activeUserAc={activeUserAc} users={state.users} />
      ) : (
        <div className="text-center py-10 text-gray-500">No users found</div>
      );
    }

    if (state.pending) {
      return pendingPosts.length > 0 ? (
        <div>
          <PendingPosts postApproved={postApproved} postRejected={postRejected} posts={pendingPosts} />
          <div className="pagination fixed bottom-0 mb-10">
            <PaginationNumber 
              totalpages={pendingState.totalPage} 
              onPageChange={getPending} 
              setCurrentState={setPendingState} 
              currentPage={pendingState.page}
            />
          </div>
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500">No pending posts</div>
      );
    }

    if (state.rejected) {
      return rejectedPosts.length > 0 ? (
        <div>
          <RejecetedPosts approveRejectedPosts={approveRejectedPosts} />
          <div className="pagination fixed bottom-0 mb-10">
            <PaginationNumber 
              totalpages={rejectedState.totalPage} 
              onPageChange={getRejected} 
              setCurrentState={setRejectedState} 
              currentPage={rejectedState.page}
            />
          </div>
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500">No rejected posts</div>
      );
    }

    return null;
  };

  function allUsers() {
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
    getAdminNotification();
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-gray-50">
      {loader ? (
        <div className="flex items-center justify-center h-screen">
          <Spinner />
        </div>
      ) : (
        <div className="flex">
          {/* Sidebar Navigation */}
          <div className="w-64 bg-white shadow-md fixed h-full">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Admin Dashboard</h2>
            </div>
            
            <nav className="p-4 space-y-2">
              <Link 
                to="/user/signup" 
                className="block px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
              >
                Add User
              </Link>
              
              <button
                onClick={allUsers}
                className={`w-full text-left px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  state.showUsers ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Users
              </button>
              
              <button
                onClick={fetchpendingPosts}
                className={`w-full text-left px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  state.pending ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Pending Approvals
              </button>
              
              <button
                onClick={fetchRejectedPosts}
                className={`w-full text-left px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  state.rejected ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Rejected Posts
              </button>
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="ml-64 p-6 w-full">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {renderContent()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;