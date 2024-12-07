import React from 'react'
import Card from '../card/Card'

function RejecetedPosts({posts,approveRejectedPosts}) {

   
  return (
    <div>
         { (
          posts.map((post) => (
          <div key={post._id} className='flex gap-2 '>
            <div className="card w-full mb-2 "> <Card post={post} /></div>
            <div className="button flex flex-col mb-2 justify-between ">
              {/* Approve and Reject buttons for each pending post */}
              <button onClick={() => { approveRejectedPosts(post._id) }} className='bg-green-600 rounded py-1 px-2'>Approve</button>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default RejecetedPosts