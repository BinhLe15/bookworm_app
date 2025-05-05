import React from 'react';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination";

interface PaginationProps {
  itemsPerPage: number;
  totalItems: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const PaginationCustom: React.FC<PaginationProps> = ({ itemsPerPage, totalItems, onPageChange, currentPage }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const getVisiblePages = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Always show first and last page
    // Show current page and 1 page on each side of current page
    pages.push(1);

     // Calculate the range around current page
     let rangeStart = Math.max(2, currentPage - 1);
     let rangeEnd = Math.min(totalPages - 1, currentPage + 1);
     
     // Adjust range to always show 3 pages when possible
     if (currentPage <= 3) {
       rangeStart = 2;
       rangeEnd = Math.min(5, totalPages - 1);
     } else if (currentPage >= totalPages - 2) {
       rangeStart = Math.max(totalPages - 4, 2);
       rangeEnd = totalPages - 1;
     }
     
     // Add ellipsis before range if needed
     if (rangeStart > 2) {
       pages.push("...");
     }
     
     // Add the range
     for (let i = rangeStart; i <= rangeEnd; i++) {
       pages.push(i);
     }
     
     // Add ellipsis after range if needed
     if (rangeEnd < totalPages - 1) {
       pages.push("...");
     }
     
     // Add last page
     pages.push(totalPages);
     
     return pages;
  };

  const visiblePages = getVisiblePages();
  const isPrevDisabled = currentPage === 1;
  const isNextDisabled = currentPage === totalPages;

  return (
    <div>
      <Pagination>
        <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                href="#" 
                onClick={(e: { preventDefault: () => void; }) => {
                  e.preventDefault();
                  if (!isPrevDisabled) onPageChange(currentPage - 1);
                }} 
                className={isPrevDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} 
              />
            </PaginationItem>
            {visiblePages.map((page, index) =>
              page === "..." ? (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    isActive={currentPage === page}
                    onClick={(e: { preventDefault: () => void; }) => {
                      e.preventDefault();
                      onPageChange(Number(page));
                    }}
                    style={{ borderColor: "#646cff" }}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              )
            )}
            <PaginationItem>
                <PaginationNext href="#" 
                  onClick={(e: { preventDefault: () => void; }) => {
                    e.preventDefault();
                    if (!isNextDisabled) onPageChange(currentPage + 1);
                  }} 
                  className={isNextDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} />
            </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default PaginationCustom;