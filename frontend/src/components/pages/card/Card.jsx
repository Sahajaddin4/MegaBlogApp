import React, { useContext, useState } from "react";
import { BlogContext } from "../../../contextApi/BlogContextApi";
import axios from "axios";

function Card({post}) {

  const{isAuthenticated}=useContext(BlogContext);
  const [isLiked,setIsLiked]=useState(false);
  const[countLike,setCountLike]=useState(post.likes.length);
  //handle like
  
 const handleLike=async()=>{
  const data={
    author:post.author,
    postId:post._id
  }
  if(isLiked)
  {
    //const dislike=await axios.post('/api/blog/api/like-dislike/like',data);
   // console.log(dislike);
    
  }
     else{
      const like=await axios.post('/api/blog/api/like-dislike/post-like',data);
      
      setIsLiked(true)
     }
      
 }
  
  return (
    <div className="p-4 flex flex-col gap-3  bg-blue-100 rounded shadow-md">
      <div className="title-author flex justify-between">
      <div className="title flex gap-2 ">
        <h1 className="text-xl font-bold">Title:</h1>
        <p>
        {post.title}
        </p>
      </div>
      <div className="author flex gap-3 justify-center items-center">
          <p className="font-medium">By</p><span className="text-sm italic">{post.author} </span>
      </div>
      </div>
     

      <div className="body flex gap-2 ">
        <h1 className="text-lg font-semibold">Descriptions:</h1>
        <p>
          {post.body}
        </p>
      </div>

      <div className="like-dislike">
      {isLiked?<i className="fa-regular fa-heart text-red-500  " onClick={handleLike}></i>:<i className="fa-regular fa-heart   " onClick={handleLike}></i>}
      </div>
    </div>
  );
}

export default Card;
