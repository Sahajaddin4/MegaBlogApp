import React from "react";
import axios from "axios";
import { toast } from "react-toastify";

function ShowComment({ comment, fetchcomments }) {
  async function deletecomment(){
    const data = {
      commentId: comment._id,
    };


    try {
        // Unlike the post
        const res = await axios.delete(
          "/api/blog/api/comment/remove-comment",
          { params: data }
        );
        // console.log(res);
        await fetchcomments();
        toast.success("Comment Deleted")
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
        <i
          onClick={deletecomment}
          className="fas fa-comment-slash float-right"
        />
      </div>
    </div>
  );
}

export default ShowComment;
