import React   from "react";

function PaginationNumber({ totalPages, currentPage, setCurrentState,  }) {



  const handlePageChange = 
    (index) => {
      
      setCurrentState(prev => ({ ...prev, page: index + 1 }));
    };

  return (
    <div className="flex">
      {Array.from({ length: totalPages }, (_, index) => {
        const isActive = currentPage === index + 1; 
        return (
          <button
          key={index}
          className={`p-1 m-1 ${isActive ? 'bg-green-500 px-3' : 'text-blue-500 px-3 hover:text-black hover:bg-[#ddd]'}`}
          onClick={() => handlePageChange(index)} 
          
        >
          {index + 1}
        </button>
        );
      })}
    </div>
  );
}

export default React.memo(PaginationNumber);
