import React from "react";

const Pagination = ({ currentPage, lastPage, onPageChange }) => {
  const generatePageNumbers = () => {
    if (lastPage <= 5) {
      return Array.from({ length: lastPage }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, "...", lastPage];
    }

    if (currentPage >= lastPage - 2) {
      return [1, "...", lastPage - 3, lastPage - 2, lastPage - 1, lastPage];
    }

    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      lastPage,
    ];
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className="pagination">
      {pageNumbers.map((page, index) =>
        page === "..." ? (
          <span key={index} className="dots">
            {page}
          </span>
        ) : (
          <button
            key={index}
            className={`page-button ${currentPage === page ? "active" : ""}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        )
      )}
    </div>
  );
};

export default Pagination;
