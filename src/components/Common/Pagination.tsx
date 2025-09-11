import React from "react";
import { DarkBgButton, LightBgButton } from "./Buttons";
interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
const Pagination = ({ currentPage, totalPages, onPageChange }: Props) => {
  const renderPageNumbers = () => {
    const pages: any = [];

    // Always show first page
    pages.push(
      <span
        key={100}
        onClick={() => onPageChange(1)}
        className={`pagination-item ${currentPage === 1 ? "active" : ""}`}
      >
        1
      </span>
    );

    // Show ellipsis if current page is far from start
    if (currentPage > 4) {
      pages.push(
        <span key="ellipsis-start" className="pagination-ellipsis">
          ...
        </span>
      );
    }

    // Show pages around current page
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);
    const conter_page = (startPage + endPage) / 2;
    pages.push(
      <span
        key="ellipsis-middle"
        onClick={() => onPageChange(conter_page)}
        className={`pagination-item ${
          currentPage === conter_page ? "active" : ""
        }`}
      >
        {conter_page}
      </span>
    );
    // for (let i = startPage; i <= endPage; i++) {
    //   pages.push(
    //     <button
    //       key={i}
    //       onClick={() => onPageChange(i)}
    //       className={`pagination-item ${currentPage === i ? "active" : ""}`}
    //     >
    //       {i}
    //     </button>
    //   );
    // }
    // Show ellipsis if current page is far from end
    if (currentPage < totalPages - 3) {
      pages.push(
        <span key="ellipsis-end" className="pagination-ellipsis">
          ...
        </span>
      );
    }
    // Always show last page if there are multiple pages
    if (totalPages > 1) {
      pages.push(
        <span
          key={12345}
          onClick={() => onPageChange(totalPages)}
          className={`pagination-item ${
            currentPage === totalPages ? "active" : ""
          }`}
        >
          {totalPages}
        </span>
      );
    }
    return pages;
  };

  return (
    <div className="pagination-container">
      <LightBgButton children="Previous" />
      <div className="pagination-pages">{renderPageNumbers()}</div>
      <DarkBgButton children="Next" />
    </div>
  );
};

export default Pagination;
