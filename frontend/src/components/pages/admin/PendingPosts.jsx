import React, { useContext } from 'react'
import Card from '../card/Card'
import { BlogContext } from '../../../contextApi/BlogContextApi'

function PendingPosts({postApproved,postRejected}) {
  const{pendingPosts}=useContext(BlogContext);
   

 
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-5 '>
       { (
          pendingPosts.map((post) => (
          <div key={post._id} className='flex gap-2 '>
            <div className="card w-full mb-2 "> <Card post={post} /></div>
            <div className="button flex flex-col mb-2 justify-between ">
              {/* Approve and Reject buttons for each pending post */}
              <button onClick={() => { postApproved(post._id) }} className='bg-green-600 rounded py-1 px-2'>Approve</button>
              <button onClick={() => {postRejected(post._id) }} className='bg-red-600 rounded py-1 px-2'>Reject</button>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default PendingPosts