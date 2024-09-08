import React, { useState } from "react";
import ShowComment from "./ShowComment";

function CommentDetails(props) {
  

  // Function to toggle modal visibility
  const handleModalClose = () => {
    props.setIsOpen(false);
    props.setCloseModal(true);
  };

  return (
    <div>
      {/* Modal */}
      {!props.closeModal && (
        <div className="fixed inset-0 z-50 flex justify-center items-center w-full h-screen bg-black bg-opacity-50">
          <div className="relative p-4 w-full max-w-md bg-white rounded-lg shadow-lg dark:bg-gray-700">
            {/* Close button */}
            <div className="body ">
             <div className="close flex justify-between mb-5">
                <h1 className="font-bold text-2xl">Comments</h1>
                <button className=" bg-red-500 rounded text-white py-1 px-3 " onClick={handleModalClose}>close</button></div>
              <div className="show comments">
                {props.comments.length > 0 ? (
                  props.comments.map((eachComment) => {
                    return <ShowComment comment={eachComment} key={eachComment._id} fetchcomments={props.fetchcomments}/>;
                  })
                ) : (
                  <p>No comment found</p>
                )}
              </div>
              
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CommentDetails;
