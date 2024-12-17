import React from 'react';

const CommentSection = ({ comment, setComment, handleComment, showComments }) => {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-2">
      {/* Comment Input */}
      <input
        type="text"
        placeholder="Add a comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="px-3 py-2 border rounded-md w-full sm:w-36 dark:bg-gray-700 dark:text-white dark:border-gray-600"
      />

      {/* Add Button */}
      <button
        onClick={handleComment}
        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
      >
        Add
      </button>

      {/* Show Comments Button */}
      <button
        onClick={showComments}
        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
      >
         <i className="fa-regular fa-comment text-lg"></i>
      </button>
    </div>
  );
};

export default React.memo(CommentSection);
