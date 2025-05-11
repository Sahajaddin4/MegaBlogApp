import React from 'react';

const CommentSection = ({ comment, setComment, handleComment, showComments }) => {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
      {/* Comment Input */}
      <input
        type="text"
        placeholder="Share your thoughts..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="flex-1 px-4 py-2 border dark:border-gray-700 rounded-full bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all w-full"
      />

      {/* Add Button */}
      <button
        onClick={handleComment}
        className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:shadow-lg transition-shadow whitespace-nowrap w-full sm:w-auto"
      >
        Post Comment
      </button>

      {/* Show Comments Button */}
      <button
        onClick={showComments}
        className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
      >
        <i className="fa-regular fa-comment-dots text-lg text-gray-600 dark:text-gray-300"></i>
      </button>
    </div>
  );
};

export default React.memo(CommentSection);