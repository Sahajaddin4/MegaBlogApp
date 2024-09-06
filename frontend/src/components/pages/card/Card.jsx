import React from "react";

function Card({post}) {

  
  
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
    </div>
  );
}

export default Card;
