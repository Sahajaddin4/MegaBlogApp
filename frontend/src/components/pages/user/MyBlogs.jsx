import axios from 'axios'
import React, { useContext, useState } from 'react'
import { BlogContext } from '../../../contextApi/BlogContextApi'
import Spinner from '../spinner/Spinner';
import { toast } from 'react-toastify';
import {  useNavigate } from 'react-router-dom';
import ConfirmationModal from '../../conrfirmationModal/ConfirmationModal';


function MyBlogs({blogs,getBlogs,setBlogs}) {
  const navigate=useNavigate();
    
    const {loader,setLoader,toastStyle}=useContext(BlogContext);
    
    const [open,setOpen]=useState(false);
    const [postId,setPostId]=useState(null);
    async function deleteBlog(){
        
        try {
           
        
            
            setLoader(true);
        let res=await axios.delete(`/api/blog/api/delete-post/${postId}`);
        if(res)
        {
             setBlogs(blogs.filter(blog=>blog._id!==postId));
            toast.success("Blog deleted successfully",toastStyle);
            
        }
        else{
             getBlogs();
            toast.error(res.message,toastStyle);
        }
    
        
        } catch (error) {
            console.log(error);
            toast.error('Server error');
            setLoader(false);
        }
    }

function show(id){
   navigate(`/blog/${id}`);
}
  
 function handleConfirmDelete()
{
   
      deleteBlog();
      setLoader(false)
}
function handleCancelDelete(){
   
    setOpen(false)
}

function handleDelete(postId){
    setPostId(postId);
    setOpen(true);
}
  return (
    <div>
          {
            loader?<Spinner/>:
            <div>
                <table className='w-full'>
                <thead className='border-2 p-2'>
                    <tr  >
                        <th className='border-r-2 p-2'>Title</th>
                        <th className='border-r-2 p-2'>Count Likes</th>
                        <th className='border-r-2 p-2'>Count Comments</th>
                        <th className='border-r-2 p-2'>Date</th>
                        <th className='border-r-2 p-2'>Approved</th>
                        <th className='border-r-2 p-2'>Status</th>
                        <th className='border-r-2 p-2'>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        blogs.map((blog) => {
                            return (
                                <tr key={blog._id}>
                                    <td className='border-2 text-center cursor-pointer' onClick={()=>show(blog._id)}>{blog.title}</td>
                                    <td className='border-2 text-center'>{blog.likes.length}</td>
                                    <td className='border-2 text-center'>{blog.comments.length}</td>
                                    <td className='border-2 text-center'> {new Date(blog.updatedAt).toLocaleString("en-GB")}</td>
                                    <td className='border-2 text-center'>{blog.approved===false?"No":"Yes"}</td>
                                    <td className='border-2 text-center'>{blog.status}</td>
                                    <td onClick={()=>{handleDelete(blog._id)}} className='border-2 text-center'><button className='bg-red-700 text-white rounded px-2 py-1 m-1 cursor-pointer hover:bg-white hover:text-red-600'>Delete</button></td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
            <ConfirmationModal 
             open={open}
             setOpen={setOpen}
             handleConfirmAction={handleConfirmDelete}
             handleCancelAction={handleCancelDelete}
             title="Delete Blog"
             message="Are you sure you want to delete your post? 
                      This action cannot be undone."
            />
            </div>
          }
    </div>
  )
}

export default MyBlogs