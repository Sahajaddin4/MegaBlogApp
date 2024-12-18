import { createContext, useContext, useMemo, useState } from "react";
import axios from "axios";
import { UserContext } from "./userAuthContext";

export const BlogContext = createContext();

export default function BlogContextProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [pendingPosts, setPendingPosts] = useState([]);
  const [rejectedPosts, setRejectedPosts] = useState([]);
  const [loader, setLoader] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const { userType } = useContext(UserContext);
  const [pendingState, setPendingState] = useState({ page: 1, totalPage: 1 });
  const [rejectedState, setRejectedState] = useState({ page: 1, totalPage: 1 });
  const [totalPages, setTotalPages] = useState(1);
  const [cachedPosts,setCachedPosts]=useState({});
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
    let user = userType === "admin" ? "1" : "0";
    try {
      let url = `/api/blog/api/get-all-posts/${user}?page=${currentPage}&limit=6`;
      setLoader(true);
      if(cachedPosts[currentPage])
      {
        setPosts(cachedPosts[currentPage].data);
        setTotalPages(cachedPosts[currentPage].totalPage);
        return;
      }
      let getposts = await axios.get(url);
      setPosts(getposts.data.data);
      setTotalPages(getposts.data.totalPage);
      setCachedPosts(prev=>({
        ...prev,
        [currentPage]:{
          data:getposts.data.data,
          totalPage:getposts.data.totalPage
        }
      }));

    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  }

  async function getPending() {
    try {
      let url = `/api/blog/api/get-pending-approval/?page=${pendingState.page}&limit=4`;
      setLoader(true);
      if(cachedPosts[`pending-${pendingState.page}`]){
        setPendingPosts(cachedPosts[`pending-${pendingState.page}`].data);
        setPendingState(prev=>({
          ...prev,
          totalPage:[`pending-${pendingState.page}`].totalPage
        }))
      }
      let getposts = await axios.get(url);
      setPendingState((prev) => ({ ...prev, totalPage: getposts.data.totalPage }));
      setPendingPosts(getposts.data.pendingApproval);
      setCachedPosts(prev=>({
        ...prev,
        [`pending-${pendingState.page}`]:{
          data:getposts.data.pendingApproval,
          totalPage:getposts.data.totalPage
        }
      }))
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  }

  async function getRejected() {
    try {
      let url = `/api/blog/api/get-rejected-posts/?page=${rejectedState.page}&limit=4`;
      setLoader(true);
      console.log(rejectedState.page,cachedPosts);
      
      if(cachedPosts[`rejected_${rejectedState.page}`]){
        setRejectedPosts(cachedPosts[`rejected_${rejectedState.page}`].data);
        setRejectedState(prev=>({
          ...prev,
          totalPage:cachedPosts[`rejected_${rejectedState.page}`].totalPage
        }))
      }
      let getposts = await axios.get(url);
      
      setRejectedState((prev) => ({ ...prev, totalPage: getposts.data.totalPage }));
      setRejectedPosts(getposts.data.rejectedPosts);
      setCachedPosts(prev=>({
        ...prev,
        [`rejected_${rejectedState.page}`]:{
          data:getposts.data.rejectedPosts,
          totalPage:getposts.data.totalPage
        }
      }))
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  }


  const value = useMemo(
    () => ({
      posts,
      getPending,
      setPendingState,
      setPosts,
      loader,
      pendingState,
      getRejected,
      setCurrentPage,
      currentPage,
      pendingPosts,
      rejectedState,
      setRejectedState,
      totalPages,
      rejectedPosts,
      toastStyle,
      setRejectedPosts,
      setPendingPosts,
      setLoader,
      setCachedPosts,
      getAllBlogPosts,
    }),
    [posts, pendingPosts, rejectedPosts,setCachedPosts, loader, currentPage, pendingState, rejectedState, totalPages]
  );

  return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>;
}
