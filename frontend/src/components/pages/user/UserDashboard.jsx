import React, {  useContext, useEffect, useState } from 'react'
import { UserContext } from '../../../contextApi/userAuthContext';
import { useNavigate } from 'react-router-dom';
import { BlogContext } from '../../../contextApi/BlogContextApi';
import axios from 'axios';
import { toast } from 'react-toastify';
import Spinner from '../spinner/Spinner';
import MyBlogs from './MyBlogs';

function UserDashboard() {

    const {isAuthenticated,userId}=useContext(UserContext);
    const {loader,setLoader,toastStyle}=useContext(BlogContext);
    const [myBlogs,setMyBlogs]=useState([]);
    const navigate=useNavigate();
    
    const getBlogs= async() => {
        try {
            setLoader(true);    
            let res=await axios.get(`/api/blog/api/get-my-blogs/${userId}`);
            setMyBlogs(res.data.blogs);
            setLoader(false);
        } catch (error) {
            setLoader(false);
            toast.error("Unable to fetch bloogs",toastStyle);
            console.log(error);
            
        }
      };

      //Condional rendering
      function renderContent(){
        if(loader)
        {
            return <Spinner/>
        }
         if(myBlogs.length>0)
        {
            return <MyBlogs blogs={myBlogs}/>
        }
        return <p>No blogs available.</p>;;
      }
 useEffect(()=>{
    setLoader(false);
     if(!isAuthenticated)
     {  
        navigate('/user/login');
     }
    getBlogs();
 },[isAuthenticated])
    
    return (
        <div className='main flex mt-10 gap-24'>
            <div className="leftSliebar ">
               <div className="btn cursor-pointer">
               <button onClick={getBlogs} className='py-1 px-2 hover:text-green-500 hover:font-bold'>My blogs</button>
               </div>
            </div>

            <div className="rightSlideBar grow">
                 {renderContent()}
            </div>
        </div>
    )
}

export default UserDashboard