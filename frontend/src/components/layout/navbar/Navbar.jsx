import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import './Navbar.css';
import appLogo from "../../../assets/appLogo.jpeg";
import { UserContext } from "../../../contextApi/userAuthContext";
import { toast } from "react-toastify";
import Cookies from 'js-cookie';
import { BlogContext } from "../../../contextApi/BlogContextApi";
import axios from "axios";
import { NotificationContext } from "../../../contextApi/NotificationContextApi";
import NotificationPanel from "../../notification/NotificationPanel";

function Navbar() {
  const { toggleNotifyModal } = useContext(NotificationContext);
  const { isAuthenticated, user, setIsAuthencticated, userType } = useContext(UserContext);
  const { toastStyle } = useContext(BlogContext);
  const navigate = useNavigate();

  function renderContent() {
    if (userType === "admin") {
      return (
        <>
          <NavLink to="/admin" className="hover:bg-gray-100 px-3 py-2 rounded-md transition-colors">
            <button className="text-gray-700 hover:text-blue-600">Dashboard</button>
          </NavLink>
          <NotificationPanel />
        </>
      )
    }
    else if (userType === "user") {
      return (
        <NavLink to="/user" className="hover:bg-gray-100 px-3 py-2 rounded-md transition-colors">
          <button className="text-gray-700 hover:text-blue-600">Dashboard</button>
        </NavLink>
      )
    }
    return null;
  }

  async function handleLogout() {
    const res = await axios.post('/api/blog/api/user/log-out');
    if(res) {
      setIsAuthencticated('');
      Cookies.remove('token');
      Cookies.remove('refreshToken');
      Cookies.remove('user');
      Cookies.remove('userId');
      Cookies.remove('userType');
      toast.warning('Logout successful', toastStyle);
      navigate('/');
    }
    else {
      toast.error("Failed to logout", toastStyle);
    }
  }

  return (
    <div className="navbar bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <img src={appLogo} alt="logo" className="h-10 w-auto" />
          </div>

          {/* Main Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {userType === "user" && (
              <NavLink to="/create-blog" className="px-3 py-2 rounded-md hover:bg-gray-100 transition-colors">
                <button className="text-gray-700 hover:text-blue-600">New Post</button>
              </NavLink>
            )}
            
            <NavLink to="/" className="px-3 py-2 rounded-md hover:bg-gray-100 transition-colors">
              <button className="text-gray-700 hover:text-blue-600">Blogs</button>
            </NavLink>
            
            <NavLink to="/about" className="px-3 py-2 rounded-md hover:bg-gray-100 transition-colors">
              <button className="text-gray-700 hover:text-blue-600">About</button>
            </NavLink>
            
            <NavLink to="/admin-contact" className="px-3 py-2 rounded-md hover:bg-gray-100 transition-colors">
              <button className="text-gray-700 hover:text-blue-600">Contact</button>
            </NavLink>

            {renderContent()}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center px-3 py-2">
                  <i className="fas fa-user-circle text-gray-400 mr-2"></i>
                  <span className="text-sm font-medium text-gray-700">{user}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/user/login" className="px-4 py-2 rounded-md hover:bg-gray-100 transition-colors">
                  <button className="text-gray-700 hover:text-blue-600">Login</button>
                </NavLink>
                <NavLink 
                  to="/user/signup" 
                  className="px-4 py-2 rounded-md text-white bg-blue-500 hover:bg-blue-600 transition-colors"
                >
                  <button>Sign Up</button>
                </NavLink>
              </>
            )}
          </div>

          {/* Mobile menu button (would need additional implementation) */}
          <div className="md:hidden flex items-center">
            <button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100">
              <span className="sr-only">Open main menu</span>
              <i className="fas fa-bars"></i>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;