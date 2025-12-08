"use client";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { LayoutGridIcon, Rows3Icon, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { SearchField } from "./SearchField";
import { useMediaGrid } from "./MediaGridContext";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";

export const MediaGridControl = () => {
  const {
    view,
    setView,
    searchQuery,
    setSearchQuery,
    sortField,
    sortDirection,
    setSortField,
    toggleSortDirection,
    totalFilteredCount
  } = useMediaGrid();
  const t = useTranslations();
  const handleSortFieldChange = (field: "title" | "year") => {
    if (sortField === field) {
      toggleSortDirection();
    } else {
      setSortField(field);
    }
  };

  const getSortIcon = (field: "title" | "year") => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-3 w-3 ml-1" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="h-3 w-3 ml-1" />
    ) : (
      <ArrowDown className="h-3 w-3 ml-1" />
    );
  };

  return (
    <div className="media-grid-control">
      <div className="controls">
        {/* Search */}
        <div className="w-full sm:w-auto sm:flex-1 sm:max-w-md">
          <SearchField searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>

        {/* Controls */}
        <div className="flex gap-3 items-center flex-wrap">
          {/* Sort Controls */}
          <ButtonGroup className="button-group">
            <Button
              className="button-group-button"
              size="sm"
              variant={sortField === "title" ? "default" : "outline"}
              onClick={() => handleSortFieldChange("title")}
            >
              {t("library.title")} {getSortIcon("title")}
            </Button>
            <Button
              className="button-group-button"
              size="sm"
              variant={sortField === "year" ? "default" : "outline"}
              onClick={() => handleSortFieldChange("year")}
            >
              {t("library.year")} {getSortIcon("year")}
            </Button>
          </ButtonGroup>

          {/* View Controls */}
          <ButtonGroup className="button-group">
            <Button
              className="button-group-button"
              size="sm"
              variant={view === "grid" ? "default" : "outline"}
              onClick={() => setView("grid")}
            >
              {t("library.grid")} <LayoutGridIcon strokeWidth={1.5} className="ml-2 h-4 w-4" />
            </Button>
            <Button
              className="button-group-button"
              size="sm"
              variant={view === "rows" ? "default" : "outline"}
              onClick={() => setView("rows")}
            >
              {t("library.rows")} <Rows3Icon strokeWidth={1.5} className="ml-2 h-4 w-4" />
            </Button>
          </ButtonGroup>
        </div>
      </div>

      {/* Results count */}
      <motion.div
        className="mt-4 text-sm text-muted-foreground font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {totalFilteredCount} {t("library.item", { count: totalFilteredCount })}
      </motion.div>
    </div>
  );
};

