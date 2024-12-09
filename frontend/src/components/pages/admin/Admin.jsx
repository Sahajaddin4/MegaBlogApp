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
  const {  loader, setLoader, toastStyle, getAllBlogPosts,rejectedPosts,pendingPosts } = useContext(BlogContext);
  const { isAuthenticated,userType } = useContext(UserContext);
  
  // Local states for managing users, posts, and UI logic
  const [users, setUsers] = useState([]);
  const [pending, setPending] = useState(false);
  const [showUsers, setShowUsers] = useState(true);
  
  const [rejected,setRejected]=useState(false);
  const [currentPage,setCurrentPage]=useState(1);
  const navigate = useNavigate();

//Active user account again
const activeUserAc=async(userId)=>{
  try {
    setLoader(true)
    let res = await axios.put(`/api/blog/api/user/active-user/${userId}`);
    if(res){
       getUserList();
      toast.success('User account  activate successfully',toastStyle);
    }
    else{
      toast.error("Error at active an user!");
    }
    setLoader(false); // Set loader state to false once data is fetched
  } catch (error) {
    console.log('Server error');
  }
}
  //Remove users 
const removeUser=async(userId)=>{
  try {
    
    let res = await axios.delete(`/api/blog/api/user/delete-user/${userId}`);
    if(res){
      getUserList();
      toast.success('User removed successfully',toastStyle);
    }
    else{
      toast.error("Error at removing a user!");
    }
    setLoader(false); // Set loader state to false once data is fetched
  } catch (error) {
    console.log('Server error');
  }
}
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


   //Approve already rejected posts
   const approveRejectedPosts=async(postId)=>{
    let res = await axios.put(`/api/blog/api/rejected-blog-approve/${postId}`);
    if (res) {
      fetchPosts();
      toast.success("Approve rejected post done", toastStyle); // Show success toast
    } else {
      toast.error("Server error!", toastStyle); // Show error toast if server fails
    }
}


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
        <UserLists removeUser={removeUser} activeUserAc={activeUserAc} users={users} />
      ) : (
        'No user found'
      );
    }

   
    if (pending) {
      return pendingPosts.length > 0 ?<PendingPosts postApproved={postApproved} postRejected={postRejected} posts={pendingPosts}/> : (
        'No pending posts' // Message when there are no posts pending approval
      );
    }

    if(rejected)
    {
      return rejectedPosts.length >0 ?<RejecetedPosts approveRejectedPosts={approveRejectedPosts} posts={rejectedPosts} />:"No rejected posts."
    }
    return null; // Default return if none of the conditions are met
  };

  // useEffect to check if the user is authenticated
  useEffect(() => {
    if (!isAuthenticated && userType!=="admin") {
      navigate('/user/login'); // If not authenticated, redirect to login page
    }
    
    getUserList();
  }, [isAuthenticated]);

  const handleNextPage=()=>{
    //console.log(currentPage);
    
    setCurrentPage(currentPage+1);
    getAllBlogPosts(currentPage);
   }
   
   const handlePrevPage=()=>{
    //console.log(currentPage);
    setCurrentPage(currentPage-1);
    getAllBlogPosts(currentPage);
   }

 const fetchPosts=async(currentPage)=>{
   
   
  await getAllBlogPosts(currentPage);
 
 }



 const fetchpendingPosts=()=>{
  //setLoader(true);
  fetchPosts();
  //setLoader(false);
  setRejected(false)
  setShowUsers(false); // Hide users list
 
  setPending(true); // Show pending posts
 }


 const fetchRejectedPosts=()=>{
  //setLoader(true);
  fetchPosts();
 // setLoader(false);
  setShowUsers(false); // Hide users list
 
  setPending(false); // Show pending posts
  setRejected(true);
 }
  return (
    <>
      {loader ? (
        <Spinner /> // Show a loading spinner while data is being fetched
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
                onClick={() => {
                  getUserList();
                  setRejected(false);
                 
                  setPending(false); // Hide pending posts
                  setShowUsers(true); // Show users list
                }}
              >
                Users
              </button>
             </div>
             
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

              {/* Rejected lists */}
              <div className="rejected-approval">
                <button
                  onClick={
                    fetchRejectedPosts
                  }
                >
                  Rejected Posts
                </button>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Displays the actual content based on state */}
          <div className="rightSlidebar grow ">
            {renderContent()} {/* Renders the content (users, posts, or pending approval) */}
          </div>
        </div>
      )}
    </>
  );
}

export default Admin;
