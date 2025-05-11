import React, { useContext, useEffect } from 'react';
import Card from './card/Card';
import { BlogContext } from '../../contextApi/BlogContextApi';
import Spinner from './spinner/Spinner';
import Pagination from './admin/Pagination';

function Home() {
    const { getAllBlogPosts, currentPage,posts, loader } = useContext(BlogContext);
   
    const fetchPosts = async () => {
        await getAllBlogPosts();
    };

    useEffect(() => {
        fetchPosts();
    }, [currentPage]);


    return (
        <div className='max-w-[90%] mx-auto my-2 py-3'>
            {loader ? (
                <Spinner />
            ) : (
                <div className='max-h-[80vh] grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-5 overflow-y-auto'>
                    {posts.map((post) => (
                        <div key={post._id}>
                            <Card post={post} />
                        </div>
                    ))}
                    <div className="pagination fixed bottom-1 mt-2 flex justify-center items-center">
                        {/* {paginationNumber()} */}
                        <Pagination />
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;
