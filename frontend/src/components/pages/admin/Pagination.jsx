import React, { useCallback, useContext } from "react";
import { BlogContext } from "../../../contextApi/BlogContextApi";
function PaginationNumber() {
  const { totalPages, currentPage, setCurrentPage } = useContext(BlogContext);
  const handlePageChange = (index) => {
    setCurrentPage(index + 1);
  };

  return (
    <nav
      className=" flex items-center justify-center gap-2"
      aria-label="Pagination"
    >
      {Array.from({ length: totalPages }, (_, index) => {
        const isActive = currentPage === index + 1;
        return (
          <button
            key={index}
            onClick={() => handlePageChange(index)}
            aria-current={isActive ? "page" : undefined}
            className={`relative inline-flex items-center justify-center w-12 h-12 text-base transition-all duration-300
              ${
                isActive
                  ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg hover:shadow-blue-500/30"
                  : "text-gray-600 hover:text-blue-600 bg-white hover:bg-gray-50 shadow-sm hover:shadow-md"
              }
              rounded-full font-semibold hover:-translate-y-0.5
              focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2`}
          >
            <span className="sr-only">Page {index + 1}</span>
            <span
              className={`${isActive ? "scale-110" : ""} transition-transform`}
            >
              {index + 1}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

export default React.memo(PaginationNumber);
