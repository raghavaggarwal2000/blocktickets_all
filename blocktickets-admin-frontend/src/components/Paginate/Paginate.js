import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";

const items = [...Array(33).keys()];

function PaginatedItems({
  itemsPerPage,
  pageCount,
  totalItems,
  setCurrentPage,
  page,
}) {
  console.log("pageCount ", pageCount);
  const [itemOffset, setItemOffset] = useState(0);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % totalItems;
    console.log(
      `User requested page number ${event.selected}, which is offset ${newOffset}`
    );
    setCurrentPage(event.selected + 1);
    setItemOffset(newOffset);
  };

  return (
    <>
      <ReactPaginate
        nextLabel="next >"
        forcePage={page - 1}
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        marginPagesDisplayed={2}
        pageCount={pageCount}
        previousLabel="< previous"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        breakLabel="..."
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName="pagination"
        activeClassName="active"
        renderOnZeroPageCount={null}
      />
    </>
  );
}

export default PaginatedItems;
