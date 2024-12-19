import { createContext, useContext, useMemo, useState } from "react";
import axios from "axios";
import { UserContext } from "./userAuthContext";

// Define the BlogContext
export const BlogContext = createContext();

const MAX_CACHE_SIZE = 3; // Max pages to keep in cache

// Function to update cache with FIFO logic
const updateCacheWithFIFO = (cache, cacheKey, newData) => {
  let newCache = { ...cache };

  // Add the new data to the cache
  newCache[cacheKey] = {
    data: newData.data,
    totalPage: newData.totalPage,
  };

  // Get all cache keys (page numbers)
  const cacheKeys = Object.keys(newCache);

  // If there are more than 3 cached pages, remove the oldest one (FIFO)
  if (cacheKeys.length > MAX_CACHE_SIZE) {
    const oldestKey = cacheKeys[0]; // The first added page (oldest)
    delete newCache[oldestKey]; // Remove the oldest page
  }

  return newCache;
};

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

  // Separate cached data for each type of post
  const [cachedPosts, setCachedPosts] = useState({
    allPostsCache: {},
    pendingPostsCache: {},
    rejectedPostsCache: {}
  });

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

  // Function to get all blog posts
  async function getAllBlogPosts() {
    let user = userType === "admin" ? "1" : "0";
    try {
      let url = `/api/blog/api/get-all-posts/${user}?page=${currentPage}&limit=6`;
      setLoader(true);

      // Check if the current page data is cached
      if (cachedPosts.allPostsCache[currentPage]) {
        setPosts(cachedPosts.allPostsCache[currentPage].data);
        setTotalPages(cachedPosts.allPostsCache[currentPage].totalPage);
        return;
      }

      let getposts = await axios.get(url);
      setPosts(getposts.data.data);
      setTotalPages(getposts.data.totalPage);

      // Cache the data and update with FIFO eviction
      setCachedPosts(prev => ({
        ...prev,
        allPostsCache: updateCacheWithFIFO(prev.allPostsCache, currentPage, getposts.data)
      }));

    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  }

  // Function to get pending posts
  async function getPending() {
    try {
      let url = `/api/blog/api/get-pending-approval/?page=${pendingState.page}&limit=4`;
      setLoader(true);

      const cacheKey = `pending-${pendingState.page}`;

      // Check if the pending posts for the current page are cached
      if (cachedPosts.pendingPostsCache[cacheKey]) {
        const cachedData = cachedPosts.pendingPostsCache[cacheKey];
        if (cachedData && cachedData.data && cachedData.totalPage !== undefined) {
          setPendingPosts(cachedData.data);
          setPendingState(prev => ({
            ...prev,
            totalPage: cachedData.totalPage,
          }));
          return; // Exit early if data is cached
        }
      }

      let getposts = await axios.get(url);
      setPendingState(prev => ({ ...prev, totalPage: getposts.data.totalPage }));
      setPendingPosts(getposts.data.pendingApproval);

      // Cache the data and update with FIFO eviction
      setCachedPosts(prev => ({
        ...prev,
        pendingPostsCache: updateCacheWithFIFO(prev.pendingPostsCache, cacheKey, getposts.data)
      }));

    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  }

  // Function to get rejected posts
  async function getRejected() {
    try {
      let url = `/api/blog/api/get-rejected-posts/?page=${rejectedState.page}&limit=4`;
      setLoader(true);

      const cacheKey = `rejected_${rejectedState.page}`;

      // Check if the rejected posts for the current page are cached
      if (cachedPosts.rejectedPostsCache[cacheKey]) {
        const cachedData = cachedPosts.rejectedPostsCache[cacheKey];
        if (cachedData && cachedData.data && cachedData.totalPage !== undefined) {
          setRejectedPosts(cachedData.data);
          setRejectedState(prev => ({
            ...prev,
            totalPage: cachedData.totalPage,
          }));
          return;
        }
      }

      let getposts = await axios.get(url);
      setRejectedState(prev => ({ ...prev, totalPage: getposts.data.totalPage }));
      setRejectedPosts(getposts.data.rejectedPosts);

      // Cache the data and update 
      setCachedPosts(prev => ({
        ...prev,
        rejectedPostsCache: updateCacheWithFIFO(prev.rejectedPostsCache, cacheKey, getposts.data)
      }));

    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  }

  // Memoize context values
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
    [posts, pendingPosts, rejectedPosts, setCachedPosts, loader, currentPage, pendingState, rejectedState, totalPages]
  );

  return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>;
}
