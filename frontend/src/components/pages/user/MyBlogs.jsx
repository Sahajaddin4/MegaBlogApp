import axios from 'axios'
import React, { useContext } from 'react'
import { BlogContext } from '../../../contextApi/BlogContextApi'
import Spinner from '../spinner/Spinner';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';


function MyBlogs({blogs}) {
  
    
    const {loader,setLoader,getAllBlogPosts,toastStyle}=useContext(BlogContext);
    async function deleteBlog(postId){
        try {
            setLoader(true);
        let res=await axios.delete(`/api/blog/api/delete-post/${postId}`);
        if(res)
        {
            toast.success("Blog deleted successfully",toastStyle);
            
        }
        else{
            toast.error(res.message,toastStyle);
        }
    
        
        } catch (error) {
            console.log(error);
            toast.error('Server error');
            setLoader(false);
        }
    }


    
    
  return (
    <div>
          {
            loader?<Spinner/>:
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
                                    <td className='border-2 text-center cursor-pointer'><Link to={`/user/my-blog/${blog._id}`}>{blog.title}</Link></td>
                                    <td className='border-2 text-center'>{blog.likes.length}</td>
                                    <td className='border-2 text-center'>{blog.comments.length}</td>
                                    <td className='border-2 text-center'> {new Date(blog.updatedAt).toLocaleString()}</td>
                                    <td className='border-2 text-center'>{blog.approved===false?"No":"Yes"}</td>
                                    <td className='border-2 text-center'>{blog.status}</td>
                                    <td onClick={async()=>{
                                        deleteBlog(blog._id);
                                        await getAllBlogPosts();
                                        setLoader(false);
                                    }} className='border-2 text-center'><button className='bg-red-700 text-white rounded px-2 py-1 m-1 cursor-pointer hover:bg-white hover:text-red-600'>Delete</button></td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
          }
    </div>
  )
}

export default MyBlogs