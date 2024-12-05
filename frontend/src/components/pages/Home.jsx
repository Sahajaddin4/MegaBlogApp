import React, { useContext,useEffect } from 'react'
import Card from './card/Card';
import { BlogContext } from '../../contextApi/BlogContextApi';
import Spinner from './spinner/Spinner';

function Home() {
    const {getAllBlogPosts,posts,loader,setLoader}=useContext(BlogContext);
    const fetchPosts=async()=>{

      await getAllBlogPosts();
      
    }
    useEffect(()=>{
     fetchPosts();
     setLoader(false);
   },[]);
    
     
  return (
    <div className='max-w-[70%]  mx-auto flex flex-col gap-5 justify-start my-5 py-3 rounded'>
            {
              loader? <Spinner />:
              posts.map((post)=>{
                return <Card key={post._id} post={post} />
              })
            }
    </div>
  )
}

export default Home;