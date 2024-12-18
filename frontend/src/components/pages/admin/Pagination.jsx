import React, { useCallback } from "react";

function PaginationNumber({ totalpages, currentPage, setCurrentState, onPageChange }) {


  const handlePageChange = useCallback(
    (index) => {
      
      setCurrentState(prev => ({ ...prev, page: index + 1 }));
      
       
      onPageChange();
    },
    [setCurrentState, onPageChange]
  );

  return (
    <div className="flex">
      {Array.from({ length: totalpages }, (_, index) => {
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
