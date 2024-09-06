import { createContext, useState } from "react";
import axios from 'axios';
export const BlogContext=createContext();

export default function BlogContextProvider({children}){
     const [posts,setPosts]=useState([]);
     const[loader,setLoader]=useState(true);
     const toastStyle={
          autoclose:500,
          
     }
    async function  getAllBlogPosts(){
         let  getposts= await axios.get('/api/blog/api/get-all-posts');
         setPosts(getposts.data.data);
        
    }

  

    const value={
      posts,
      setPosts,
      loader,
      toastStyle,
      setLoader,
      getAllBlogPosts
    }

    return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>
}