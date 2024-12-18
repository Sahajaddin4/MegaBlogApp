import React from "react";

function PaginationNumber({ totalpages, currentPage, setCurrentState }) {
    
    
  return (
    <div className="flex">
      {Array.from({ length: totalpages }, (_, index) => {
        const isActive = currentPage === index + 1; // Check if current page is active
        return (
          <button
            className={`p-1 m-1 ${isActive ? 'bg-green-500 px-3' : 'text-blue-500 px-3 hover:text-black hover:bg-[#ddd]'}`}
            key={index}
            onClick={() => {
                setCurrentState(prev=>({...prev,page:index+1})); // Set the new current page
            }}
          >
            {index + 1}
          </button>
        );
      })}
    </div>
  );
}

export default PaginationNumber;
