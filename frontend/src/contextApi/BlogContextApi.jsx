import { createContext, useState } from "react";
import axios from "axios";
export const BlogContext = createContext();

export default function BlogContextProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [loader, setLoader] = useState(true);

  const toastStyle = {
    position: "top-center",
    autoClose: 500,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "light",
   
  };
  async function getAllBlogPosts() {
    let getposts = await axios.get("/api/blog/api/get-all-posts",{
      withCredentials:true
    });
    setPosts(getposts.data.data);
  }

  const value = {
    posts,
    setPosts,
    loader,
    toastStyle,
    setLoader,
    getAllBlogPosts,
  };

  return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>;
}
