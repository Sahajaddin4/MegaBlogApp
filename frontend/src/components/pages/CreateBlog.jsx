import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contextApi/UserAuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { BlogContext } from "../../contextApi/BlogContextApi";

function CreateBlog() {
  const { isAuthenticated } = useContext(UserContext);
  const { toastStyle, setCachedPosts } = useContext(BlogContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/user/login');
    }
  }, [isAuthenticated]);

  const [blogData, setBlogData] = useState({
    title: "",
    body: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setBlogData(prevData => ({
      ...prevData,
      [name]: value
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      let res = await axios.post('/api/blog/api/create-post', blogData);
      toast.success(res.data.message, toastStyle);
      setCachedPosts({});
      navigate('/');
    } catch (error) {
      toast.error('Failed to create post!', toastStyle);
    } finally {
      setBlogData({
        title: "",
        body: "",
      });
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
      <div className="max-w-2xl w-full animate-fade-in">
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl shadow-2xl overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-center rounded-t-3xl">
            <h1 className="text-3xl font-extrabold text-white drop-shadow-lg">Create Your Blog Post</h1>
            <p className="text-blue-100 mt-1 italic">Share your story with the world 🌍</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Title Field */}
            <div className="space-y-1">
              <label htmlFor="title" className="block text-base font-semibold text-gray-700 dark:text-gray-200">
                Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                value={blogData.title}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white shadow-sm transition-all duration-200"
                placeholder="Enter your blog title"
              />
            </div>

            {/* Body Field */}
            <div className="space-y-1">
              <label htmlFor="body" className="block text-base font-semibold text-gray-700 dark:text-gray-200">
                Content
              </label>
              <textarea
                value={blogData.body}
                name="body"
                id="body"
                maxLength={10000}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white shadow-sm transition-all duration-200"
                placeholder="Write your blog content here..."
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold py-2.5 px-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                Publish Blog
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateBlog;
