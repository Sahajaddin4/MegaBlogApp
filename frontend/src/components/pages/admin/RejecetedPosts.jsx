import React, { useContext } from 'react'
import Card from '../card/Card'
import { BlogContext } from '../../../contextApi/BlogContextApi'

function RejectedPosts({ approveRejectedPosts }) {
  const { rejectedPosts } = useContext(BlogContext);

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 p-4'>
      {rejectedPosts.map((post) => (
        <div key={post._id} className='bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300'>
          {/* Card Content */}
          <div className="p-4">
            <Card post={post} />
          </div>
          
          {/* Action Button - Always Visible */}
          <div className="flex p-4 bg-gray-50 border-t border-gray-200">
            <button 
              onClick={() => approveRejectedPosts(post._id)} 
              className="flex items-center justify-center bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 w-full"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Approve
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default RejectedPosts