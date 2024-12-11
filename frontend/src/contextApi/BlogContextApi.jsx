import { createContext,  useContext,  useMemo,  useState } from "react";
import axios from "axios";
import { UserContext } from "./userAuthContext";
export const BlogContext = createContext();

export default function BlogContextProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [pendingPosts,setPendingPosts]=useState([]);
  const [rejectedPosts,setRejecetedPosts]=useState([]);
  const [loader, setLoader] = useState(true);
  const {userType}=useContext(UserContext);
 
  const [totalPages,setTotalPages]  =useState(1);
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
  async function getAllBlogPosts(currentPage) {
    let user="0";
    if(userType==="admin"){
      user="1" ;  
    }
   try {
    let url=`/api/blog/api/get-all-posts/${user}?page=${currentPage}&limit=${5}`;
    setLoader(true);
    let getposts = await axios.get(url);
    let tempPosts=getposts.data.data.filter((post)=>post.status==="active");
    let pending=getposts.data.data.filter((post)=>post.approved===false && post.status==="active");
    let rejected=getposts.data.data.filter((post)=>post.status==="rejected");
    setPosts(tempPosts);
    setPendingPosts(pending);
    setRejecetedPosts(rejected);
    setTotalPages(getposts.data.totalPage);
    setLoader(false);
   } catch (error) {
     console.log(error); 
   }
  }

  const value = useMemo(()=>({
    
      posts,
      setPosts,
      loader,
      pendingPosts,
      totalPages,
      rejectedPosts,
      toastStyle,
      setRejecetedPosts,
      setPendingPosts,
      setLoader,
      getAllBlogPosts, 
    
  }),[getAllBlogPosts]);

  return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>;
}
