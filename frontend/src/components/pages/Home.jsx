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
    
   const handleNextPage=()=>{
    setCurrentPage(currentPage<totalPages?currentPage+1:currentPage);
   }
   
   const handlePrevPage=()=>{
    setCurrentPage(currentPage>1?currentPage-1:currentPage);
   }

   
  return (
    <div className='max-w-[90%]  max-h-[85vh] mx-auto flex flex-col gap-5 justify-start my-2 py-3 rounded'>
            {
              loader? <Spinner />:
             <div className='overflow-y-scroll '>
              { posts.map((post)=>{
                return <div key={post._id} className='mb-2'> <Card  post={post} /></div>
              })}
              <div className="pagination fixed bottom-0 w-[78%] my-2 flex gap-5">
                {
                  currentPage!==1?<div className="previous">
                  <button onClick={handlePrevPage} className='py-1  px-3 border-2 mt-2 rounded '>Previous</button>
            </div>:""
                }
                {
                  currentPage!==totalPages?<div className="next">
                  <button className='py-1  px-3 border-2 mt-2 rounded' onClick={handleNextPage}>Next</button>
              </div>:""
                }
              </div>
             </div>
            }
    </div>
  )
}

export default Home;