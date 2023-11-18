import React from "react";
import './pagination.css';

const Pagination = ({ postsPerPage, totalPosts, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }
  
  return (
    <div>
    {currentPage && totalPosts && <div className="showingResult">Showing Page {currentPage} of {Math.ceil(totalPosts/postsPerPage)}</div>}
      <ul className="pagination centerMe">
        {pageNumbers.map((number) => (
          <li key={number} className={"page-item"}>
            <div onClick={() => paginate(number)} className={(currentPage === number) ?"page-link page-link-active": "page-link"}>
              {number}
            </div>
          </li>
        ))}
      </ul>
      
    </div>
  );
};

export default Pagination;
