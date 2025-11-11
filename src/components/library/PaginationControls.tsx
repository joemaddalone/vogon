"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useMediaGrid } from "./MediaGridContext";
import { motion } from "motion/react";

export function PaginationControls() {
  const { currentPage, totalPages, setCurrentPage, totalFilteredCount, itemsPerPage } = useMediaGrid();

  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalFilteredCount);

  const handleFirstPage = () => setCurrentPage(1);
  const handlePreviousPage = () => setCurrentPage(Math.max(1, currentPage - 1));
  const handleNextPage = () => setCurrentPage(Math.min(totalPages, currentPage + 1));
  const handleLastPage = () => setCurrentPage(totalPages);

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showPages = 5; // Number of page buttons to show

    if (totalPages <= showPages + 2) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if we're near the start
      if (currentPage <= 3) {
        endPage = showPages - 1;
      }

      // Adjust if we're near the end
      if (currentPage >= totalPages - 2) {
        startPage = totalPages - (showPages - 2);
      }

      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pages.push("...");
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pages.push("...");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="pagination-controls"
    >
      {/* Results info */}
      <div className="results">
        Showing <span>{startItem}</span> to{" "}
        <span>{endItem}</span> of{" "}
        <span>{totalFilteredCount}</span> results
      </div>

      {/* Pagination controls */}
      <div className="pager-group">
        {/* First page */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleFirstPage}
          disabled={currentPage === 1}
          aria-label="First page"
          className="pager"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>

        {/* Previous page */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          aria-label="Previous page"
          className="pager"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Page numbers */}
        <div className="page-number-group">
          {getPageNumbers().map((page, index) => (
            page === "..." ? (
              <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
                ...
              </span>
            ) : (
              <Button
                key={page}
                variant={currentPage === page ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setCurrentPage(page as number)}
                className="page-number"
              >
                {page}
              </Button>
            )
          ))}
        </div>

        {/* Mobile: current page indicator */}
        <div className="sm:hidden px-4 py-2 text-sm font-medium bg-muted/50 rounded-xl">
          Page {currentPage} of {totalPages}
        </div>

        {/* Next page */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          aria-label="Next page"
          className="pager"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Last page */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLastPage}
          disabled={currentPage === totalPages}
          aria-label="Last page"
          className="pager"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}

