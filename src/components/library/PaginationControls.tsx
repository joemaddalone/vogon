"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useMediaGrid } from "./MediaGridContext";
import { FadeIn } from "@/components/FadeIn";

import { useTranslations } from "next-intl";
export function PaginationControls() {
  const { currentPage, totalPages, setCurrentPage, totalFilteredCount, itemsPerPage } = useMediaGrid();
  const t = useTranslations();
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
    <FadeIn className="pagination-controls">
      {/* Results info */}
      <div className="results">
        {t("library.showing")} <span>{startItem}</span> to{" "}
        <span>{endItem}</span> of{" "}
        <span>{totalFilteredCount}</span> {t("library.results")}
      </div>

      {/* Pagination controls */}
      <div className="pager-group">
        {/* First page */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleFirstPage}
          disabled={currentPage === 1}
          aria-label={t("library.firstPage")}
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
          aria-label={t("library.previousPage")}
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
                variant={currentPage === page ? "default" : "ghost"}
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
          {t("library.page")} {currentPage} {t("library.of")} {totalPages}
        </div>

        {/* Next page */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          aria-label={t("library.nextPage")}
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
          aria-label={t("library.lastPage")}
          className="pager"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </FadeIn>
  );
}

