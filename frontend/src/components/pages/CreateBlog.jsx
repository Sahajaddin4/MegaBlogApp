import React, { useState } from "react";

function CreateBlog() {

  const [blogData,setBlogData]=useState({
    title:"",
    body:"",
    author:""
  })

  function handleChange(e){
     const{name,value}=e.target;
     setBlogData(prevData=>{
      return {
        ...prevData,
        [name]:value
      }
     })
  }
 
  //data send to database function
  

  return (
    <div className="login w-[30em] mt-20 h-[20em] mx-auto rounded-lg shadow-2xl border px-4 py-2 m-2">
      <div className="heading text-center mb-5">
        <h1 className="text-2xl font-bold">Create Blog</h1>
      </div>
      <div className="form">
        <form className="flex flex-col gap-5">
          {/* Email input field */}
          <div className="title flex gap-2 items-center">
            <label htmlFor="#title">Title: </label>
            <input
              type="text"
              name="title"
              id="title"

              onChange={handleChange}
             value={blogData.title}
              className="border-2 ml-2 hover:border-blue-400 py-2 rounded w-full"
            />
          </div>

          {/* Password input field with toggle icon */}
          <div className="body flex gap-2 items-center">
            <label htmlFor="body">Body:</label>
            <div className="relative border-2 hover:border-blue-400 py-2 rounded w-full">
              {/* Password input field */}
              <textarea
                value={blogData.body}
                name="body"
                id="body"
                minLength={500}
                onChange={handleChange}
              
                className="w-full border-none outline-none pr-10"
              />

              {/* Toggle icon to show/hide password */}
              <div>
                
              </div>
            </div>
          </div>
          <div className="body flex gap-2 items-center">
            <label htmlFor="author">Author:</label>
            <div className="relative border-2 hover:border-blue-400 py-2 rounded w-full">
              {/* Password input field */}
              <input
              value={blogData.author}
               type="text"
                name="author"
                id="author"
                
                onChange={handleChange}
                className="w-full border-none outline-none pr-10"
              />

              {/* Toggle icon to show/hide password */}
              <div>

              </div>
            </div>
          </div>
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
// title, body, author
export default CreateBlog;
