import React, { useContext, useEffect, useState } from 'react'
import Card from '../card/Card'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';
import { UserContext } from '../../../contextApi/userAuthContext';
import { BlogContext } from '../../../contextApi/BlogContextApi';
import Spinner from '../spinner/Spinner';


function ShowMyBlog() {
    const navigate=useNavigate();
    const {isAuthenticated,userType}=useContext(UserContext);
    const {loader,setLoader}=useContext(BlogContext);
    const [blog,setBlog]=useState(null);
  const {id}=useParams();
 
  
  const getMyBlog=async()=>{
     try {
        let res= await axios.get(`/api/blog/api/get-blog/${id}`);
        console.log(res);
        if(res){
  
            setBlog(res.data.blog);
            
        }
        
     } catch (error) {
        console.log(error);
        
     }
      setLoader(false);
  }
  useEffect(()=>{
    if(!isAuthenticated && userType!=="user")
    {
      navigate('/user/login');
    }
    getMyBlog();
  },[]);


  function renderContent(){
    if(loader){
        return <Spinner />
    }
    if(blog!==null)
    {
        return <Card post={blog}/>
    }
    else {
        return <p>No blog</p>;
    }
  }
  return (
    <div className='mt-12 flex gap-20'>
      <div className="back-dashboard">
        <Link to={'/user'}><button className='cursor-pointer
         bg-blue-500 text-white 
         px-3 py-1 rounded
         hover:text-blue-500 hover:bg-white'>Back</button></Link>
      </div>
   <div className="right grow w-full">
   {renderContent()}
   </div>
    </div>
  )
}
export default ShowMyBlog;