import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contextApi/UserAuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { BlogContext } from "../../contextApi/BlogContextApi";
function CreateBlog() {
  // State to manage blog data
  const{isAuthenticated}=useContext(UserContext);
  const{toastStyle}=useContext(BlogContext);
  const navigate=useNavigate();
  useEffect(()=>{
    if(!isAuthenticated)
      {
        
          navigate('/user/login');
      }
   
     
  },[isAuthenticated]);

  const [blogData, setBlogData] = useState({
    title: "",
    body: "",
    
  });

  // Function to handle changes in the input fields
  function handleChange(e) {
    const { name, value } = e.target;
    setBlogData(prevData => ({
      ...prevData,
      [name]: value
    }));
  }

  // Function to handle form submission (e.g., sending data to the database)
  async function handleSubmit(e) {
    e.preventDefault();
    // Implement data submission logic here
   
      try {
         let res=await axios.post('/api/blog/api/create-post',blogData);
         toast.success(res.data.message,toastStyle);
        navigate('/');
         
      } catch (error) {
        toast.error('Failed to create post!',toastStyle);
      }
      finally{
        setBlogData({
          title: "",
          body: "",
        })
      }
    // Example: Logs the blog data to the console
  }

  return (
    <div className="login w-[30em] mt-20 h-[20em] mx-auto rounded-lg shadow-2xl border px-4 py-2 m-2">
      <div className="heading text-center mb-5">
        <h1 className="text-2xl font-bold">Create Blog</h1>
      </div>
      <div className="form">
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}> 
          {/* Title input field */}
          <div className="title flex gap-2 items-center">
            <label htmlFor="title">Title: </label>
            <input
              type="text"
              name="title"
              id="title"
              value={blogData.title}
              onChange={handleChange}
              className="border-2 ml-2 hover:border-blue-400 py-2 rounded w-full"
            />
          </div>

          {/* Body textarea field */}
          <div className="body flex gap-2 items-center">
            <label htmlFor="body">Body:</label>
            <div className="relative border-2 hover:border-blue-400 py-2 rounded w-full">
              <textarea
                value={blogData.body}
                name="body"
                id="body"
                maxLength={10000}
                onChange={handleChange}
                className="w-full border-none outline-none pr-10"
              />
            </div>
          </div>

          {/* Author input field
          <div className="author flex gap-2 items-center">
            <label htmlFor="author">Author:</label>
            <div className="relative border-2 hover:border-blue-400 py-2 rounded w-full">
              <input
                value={blogData.author}
                type="text"
                name="author"
                id="author"
                onChange={handleChange}
                className="w-full border-none outline-none pr-10"
              />
            </div>
          </div> */}

          {/* Submit button */}
          <div className="btn text-center mt-5">
            <button
              type="submit"
              className="py-2 px-4 rounded w-[60%] mx-auto bg-blue-600 text-white"
            >
              Add Blog
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateBlog;
