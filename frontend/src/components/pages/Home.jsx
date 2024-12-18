import React, { useContext, useEffect } from 'react';
import Card from './card/Card';
import { BlogContext } from '../../contextApi/BlogContextApi';
import Spinner from './spinner/Spinner';

function Home() {
    const { getAllBlogPosts, currentPage, setCurrentPage, posts, totalPages, loader } = useContext(BlogContext);
   
    const fetchPosts = async () => {
        await getAllBlogPosts();
    };

    useEffect(() => {
        fetchPosts();
    }, [currentPage]);


    const paginationNumber = () => {
        return Array.from({ length: totalPages }, (_, index) => {
            const isActive = currentPage === index + 1; // Check if current page is active
            return (
                <button
                    className={`p-1 m-1 ${isActive ? 'bg-green-500 px-3' : 'text-blue-500 px-3 hover:text-black hover:bg-[#ddd]'}`}
                    key={index}
                    onClick={() => {
                      
                      setCurrentPage(index + 1)} }
                >
                    {index + 1}
                </button>
            );
        });
    };

    return (
        <div className='max-w-[90%] mx-auto my-2 py-3'>
            {loader ? (
                <Spinner />
            ) : (
                <div className='max-h-[80vh] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
                    {posts.map((post) => (
                        <div key={post._id}>
                            <Card post={post} />
                        </div>
                    ))}
                    <div className="pagination fixed bottom-0 mb-10 flex justify-center mt-4">
                        {paginationNumber()}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;
