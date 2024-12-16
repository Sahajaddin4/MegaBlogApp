import React, { useContext,useEffect, useState } from 'react'
import Card from './card/Card';
import { BlogContext } from '../../contextApi/BlogContextApi';
import Spinner from './spinner/Spinner';
function Home() {
    const {getAllBlogPosts,posts,totalPages,loader}=useContext(BlogContext);
    const [currentPage,setCurrentPage]=useState(1);
    const fetchPosts=async(currentPage)=>{
       
      await getAllBlogPosts(currentPage);
      
    }
    useEffect(()=>{
     
       
     fetchPosts(currentPage);
    
   },[currentPage]);
    

  const paginationNumber=()=>{
    return Array.from({length:totalPages},(_,index)=>{
      return <button className={`p-1 text-blue-500 hover:text-black m-1`}key={index} onClick={()=>{setCurrentPage(index+1)
      }}>{index+1}</button>
    })
  }
   
  return (
    <div className='max-w-[90%] relative max-h-[85vh] mx-auto   my-2 py-3 rounded'>
            {
              loader? <Spinner />:
             <div className=' h-[80vh] mb-5 overflow-y-scroll relative left-20 flex flex-wrap gap-5 '>
              { posts.map((post)=>{
                return <div key={post._id} className='mb-2'> <Card  post={post} /></div>
              })}
              <div className="pagination fixed bottom-0  w-[78%] my-2 flex gap-3">
                
                {
                  paginationNumber()
                }
              </div>
             </div>
            }
    </div>
  )
}

export default Home;