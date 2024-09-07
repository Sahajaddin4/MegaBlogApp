import React, { useContext, useEffect, useState } from "react";
import { BlogContext } from "../../../contextApi/BlogContextApi";
import axios from "axios";
import { UserContext } from "../../../contextApi/UserAuthContext";

function Card({ post }) {
  //const { getLike } = useContext(BlogContext);
  const { isAuthenticated, user } = useContext(UserContext);
  const [isLiked, setIsLiked] = useState(false);
  const [countLike, setCountLike] = useState(post.likes.length);
  const [isExpanded,setIsExpanded]=useState(false);
  const [truncatedPost,setTruncatedPost]=useState();
  //handle like

  const toggleExpand=()=>{
    setIsExpanded(!isExpanded);
  }
  const truncateDesc=()=>{

      if(post && !isExpanded) {setTruncatedPost(post.body.substring(0,100))};
  }
  const handleLike = async () => {
    const data = {
      author: user,
      postId: post._id,
    };

    if (isLiked) {
      const res = await axios.delete(
        "/api/blog/api/like-dislike/post-dislike",
        { params: data }
      );
      //console.log('Dislike:',res);

      setIsLiked(res.data.isLiked);
    } else {
      const res = await axios.post(
        "/api/blog/api/like-dislike/post-like",
        data
      );
      ///console.log('like:',res.data.isLiked);

      setIsLiked(res.data.isLiked);
    }
  };
  async function getLike(post, author) {
    const data = {
      post: post,
      author: author,
    };

    let res = await axios.get("/api/blog/api/like-dislike/get-like", {
      params: data,
    });

    //console.log(res.data);

    setIsLiked(res.data.isLiked);
  }

  async function getAllLike(post) {
    let res = await axios.get("/api/blog/api/like-dislike/get-like-count", {
      params: { post },
    });
    setCountLike(res.data.countedLike);
  }
  useEffect(() => {
    getLike(post._id, user);
    getAllLike(post._id);
  }, [handleLike]);
 useEffect(()=>{
  truncateDesc();
 },[isExpanded]);
  return (
    <div className="p-4 flex flex-col gap-3  bg-blue-100 rounded shadow-md">
      <div className="title-author flex justify-between">
        <div className="title flex gap-2 ">
          <h1 className="text-xl font-bold">Title:</h1>
          <p>{post.title}</p>
        </div>
        <div className="author flex gap-3 justify-center items-center">
          <p className="font-medium">By</p>
          <span className="text-sm italic">{post.author} </span>
        </div>
      </div>

      <div className="body flex gap-2 ">
        <h1 className="text-lg font-semibold">Descriptions:</h1>
          {!isExpanded?(<p>
            {truncatedPost}<span onClick={toggleExpand} className="hover:cursor-pointer italic text-green-400 ml-5">.read more..</span>
          </p>):(<p>
            {post.body}<span onClick={toggleExpand} className=" ml-5 italic hover:cursor-pointer text-red-400">shrink post</span>
          </p>)} 
      </div>

{/* Like-commensts section */}
      <div className="last-section flex justify-between">
      <div className="like-dislike">
        {isAuthenticated ? (
          isLiked ? (
            <i
              className="fa-regular fa-heart text-red-500 hover:cursor-pointer "
              onClick={handleLike}
            ></i>
          ) : (
            <i
              className="fa-regular fa-heart  hover:cursor-pointer  "
              onClick={handleLike}
            ></i>
          )
        ) : (
          <i className="fa-regular fa-heart hover:cursor-not-allowed  "></i>
        )}
        <span>{countLike}</span>
      </div>

      <div className="comments flex gap-2">
         <span><i className="fa-regular fa-comment"></i></span>
          <input type="text" name="comment" id="comment" className="rounded hover:border hover:border-blue-400" />
      </div>
      </div>
    </div>
  );
}

export default Card;
