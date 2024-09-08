import React from 'react'

function ShowComment({comment}) {
  return (
   
        <div className='showComments rounded-xl p-2 bg-gray-200 mb-3'>
                <h1 className='font-bold'>{comment.author}</h1>
                <p>{comment.comment}</p>
        </div>
  
  )
}

export default ShowComment;