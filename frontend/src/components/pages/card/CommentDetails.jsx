import React from "react";
import ShowComment from "./ShowComment";

function CommentDetails(props) {
  // Function to toggle modal visibility
  const handleModalClose = () => {
    props.setIsOpen(false);
    props.setCloseModal(true);
  };

  return (
    <div>
      {/* Modal Overlay */}
      {!props.closeModal && (
        <div className="fixed inset-0 z-50 flex justify-center items-center w-full h-screen bg-black bg-opacity-50">
          {/* Modal Content */}
          <div className="relative max-h-[80vh] w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-auto">
            {/* Close button */}
            <div className="flex justify-between items-center p-4 border-b">
              <h1 className="font-bold text-2xl">Comments</h1>
              <button
                className="bg-red-500 rounded text-white py-1 px-3"
                onClick={handleModalClose}
              >
                Close
              </button>
            </div>

            {/* Comments */}
            <div className="show-comments p-4 space-y-4 max-h-[60vh] overflow-auto">
              {props.comments.length > 0 ? (
                props.comments.map((eachComment) => (
                  <ShowComment
                  setAllComments={props.setAllComments}
                    comment={eachComment}
                    key={eachComment._id}
                    setCountComment={props.setCountComment}
                    countComment={props.countComment}
                  />
                ))
              ) : (
                <p className="text-center text-gray-600">No comments found</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CommentDetails;
