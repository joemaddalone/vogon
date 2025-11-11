"use client";

import { useState, useEffect, useRef, startTransition } from "react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import { SearchIcon, XIcon } from "lucide-react";

export const SearchField = ({
  size = "default",
  searchQuery,
  setSearchQuery
}: {
  size?: "default" | "xl";
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}) => {
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const isInternalChangeRef = useRef(false);

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      isInternalChangeRef.current = true;
      setSearchQuery(localQuery);
      // Reset the flag after a short delay to allow URL update to complete
      setTimeout(() => {
        isInternalChangeRef.current = false;
      }, 100);
    }, 500);

    return () => clearTimeout(timer);
  }, [localQuery, setSearchQuery]);

  // Sync with external changes (like back button navigation)
  // But don't overwrite if the change came from within this component
  useEffect(() => {
    startTransition(() => {
    if (!isInternalChangeRef.current && searchQuery !== localQuery) {
        setLocalQuery(searchQuery);
      }
    });
  }, [searchQuery]);

  const handleClear = () => {
    setLocalQuery("");
    setSearchQuery("");
  };

  return (
    <div className="flex gap-2 w-full">
      <ButtonGroup className="flex-1">
        <div className="relative flex-1">
          <Input
            className={size === "xl" ? "h-12 text-lg w-full rounded-xl rounded-r-none" : "w-full h-[42px] rounded-xl px-4 rounded-r-none"}
            type="text"
            name="query"
            placeholder="Search by title..."
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
          />
          {localQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-110"
              aria-label="Clear search"
            >
              <XIcon className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button
          className={size === "xl" ? "h-12 text-lg rounded-xl" : "h-[42px] rounded-xl"}
          type="button"
          variant="outline"
          aria-label="Search"
        >
          <SearchIcon className="h-4 w-4" />
        </Button>
      </ButtonGroup>
    </div>
  );
}