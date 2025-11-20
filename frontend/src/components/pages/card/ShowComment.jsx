import React, { useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { BlogContext } from "../../../contextApi/BlogContextApi";
import { UserContext } from "../../../contextApi/UserAuthContext";

function ShowComment({ comment, fetchcomments }) {
  const{toastStyle}=useContext(BlogContext);
  const {userId}=useContext(UserContext);
  async function deletecomment(){
    const data = {
      commentId: comment._id,
      userId:userId
    };

 
    try {
        // Unlike the post
        const res = await axios.delete(
          "/api/blog/api/comment/remove-comment",
          { params: data }
        );
        if(res.data.success===false)
        {
          toast.error(res.data.message,toastStyle);
          await fetchcomments();
          return;
        }
      
        else{
          await fetchcomments();
          toast.success("Comment Deleted",toastStyle);
        }
        
        
  }
  catch(e){
    console.log(e);
  }
  }

  return (
    <div className="showComments rounded-xl p-2 bg-gray-200 mb-3  ">
      <div>
        <h1 className="font-bold">{comment.author}</h1>
        <p>{comment.comment}</p>
      </div>
      <div>
        <button className="float-right " onClick={deletecomment}>
        <i
          
          className="fas fa-comment-slash  hover:cursor-pointer"
        />
        </button>
      </div>
    </div> 
  );
}

export default ShowComment;
