import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Spinner from '../spinner/Spinner';
import { BlogContext } from '../../../contextApi/BlogContextApi';
import { UserContext } from '../../../contextApi/userAuthContext';
import { toast } from 'react-toastify';
import UserLists from './UserLists';
import axios from 'axios';

function Admin() {
  const { loader, setLoader, toastStyle, setPendingPosts, setRejectedPosts, getPending, getRejected, pendingState, rejectedState } = useContext(BlogContext);
  const { isAuthenticated, userType } = useContext(UserContext);

  const [users, setUsers] = useState([]);

  const navigate = useNavigate();

  const getUserList = useCallback(async () => {
    try {
      let res = await axios.get('/api/blog/api/user/get-users');
      setUsers(res.data.userLists);
      setLoader(false);
    } catch (error) {
      console.log('Server error');
    }
  }, []);

  const activeUserAc = async (userId) => {
    try {
      setLoader(true);
      let res = await axios.put(`/api/blog/api/user/active-user/${userId}`);
      if (res) {
        setUsers(prevUsers => prevUsers.map(user => user._id === userId ? { ...user, status: "active" } : user));
        toast.success('User account activated successfully', toastStyle);
      } else {
        toast.error('Error activating user!');
      }
      setLoader(false);
    } catch (error) {
      console.log('Server error');
    }
  };

  const removeUser = async (userId) => {
    try {
      let res = await axios.delete(`/api/blog/api/user/delete-user/${userId}`);
      if (res) {
        setUsers(prevUsers => prevUsers.map(user => user._id === userId ? { ...user, status: "inactive" } : user));
        toast.success('User removed successfully', toastStyle);
      } else {
        toast.error('Error removing user!');
      }
      setLoader(false);
    } catch (error) {
      console.log('Server error');
    }
  };

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
        <div className="flex gap-10 mt-10 overflow-hidden">
          <div className="leftSlidebar overflow-hidden max-h-[100vh] min-w-[200px] justify-start flex flex-col gap-2 pr-5 border-r-2">
            <div className="adminDetails"></div>
            <div className="adminControler flex flex-col">
              <div>
                <Link to="/user/signup">
                  <button className="userAdd cursor-pointer">Add User</button>
                </Link>
              </div>

              <div>
                <Link to="/admin">
                  <button className="userList cursor-pointer">Users</button>
                </Link>
              </div>

              <div className="pending-approval">
                <Link to="/admin/pending-approvals">
                  <button>Pending Approvals</button>
                </Link>
              </div>

              <div className="rejected-approval">
                <Link to="/admin/rejected-posts">
                  <button>Rejected Posts</button>
                </Link>
              </div>
            </div>
          </div>

          <div className="rightSlidebar grow">
            <UserLists
              removeUser={removeUser}
              activeUserAc={activeUserAc}
              users={users}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default Admin;
