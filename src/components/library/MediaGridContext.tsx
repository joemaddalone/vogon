"use client";

import { createContext, useContext, useCallback, useMemo, useReducer, ReactNode, useRef, useEffect, useTransition } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import type { Media,Selectable } from "@/lib/types";
import { Route } from "next";


const removeArticle = (title: string) => {
  return title.replace(/^(a|an|the)\s+/i, '');
};

// Types
type SortField = "title" | "year";
type SortDirection = "asc" | "desc";

interface MediaGridState {
  items: Selectable<Media>[];
  itemsPerPage: number;
}

interface MediaGridContextValue extends MediaGridState {
  searchQuery: string;
  sortField: SortField;
  sortDirection: SortDirection;
  view: "grid" | "rows";
  currentPage: number;

  // Actions
  setSearchQuery: (query: string) => void;
  setSortField: (field: SortField) => void;
  setSortDirection: (direction: SortDirection) => void;
  toggleSortDirection: () => void;
  setView: (view: "grid" | "rows") => void;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (count: number) => void;

  // Computed values
  filteredAndSortedItems: Selectable<Media>[];
  paginatedMovies: Selectable<Media>[];
  totalPages: number;
  totalFilteredCount: number;
}

// Actions (simplified - only for local state)
type Action =
  | { type: "SET_ITEMS"; payload: Selectable<Media>[] }
  | { type: "SET_ITEMS_PER_PAGE"; payload: number };

// Reducer (simplified - only handles local state)
function mediaGridReducer(state: MediaGridState, action: Action): MediaGridState {
  switch (action.type) {
    case "SET_ITEMS":
      return { ...state, items: action.payload };
    case "SET_ITEMS_PER_PAGE":
      return { ...state, itemsPerPage: action.payload };
    default:
      return state;
  }
}

// Context
const MediaGridContext = createContext<MediaGridContextValue | null>(null);

// Provider Props
interface MediaGridProviderProps {
  children: ReactNode;
  initialItems: Selectable<Media>[];
  initialItemsPerPage?: number;
}

// Provider Component
export function MediaGridProvider({
  children,
  initialItems,
  initialItemsPerPage = 24
}: MediaGridProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
  }, []);

  // Read URL params and memoize the values
  const currentPage = useMemo(() => {
    const page = parseInt(searchParams.get("page") || "1", 10);
    return page > 0 ? page : 1;
  }, [searchParams]);

  const searchQuery = useMemo(() => {
    return searchParams.get("q") || "";
  }, [searchParams]);

  const sortField = useMemo(() => {
    const sort = searchParams.get("sort") as SortField;
    return sort === "year" ? "year" : "title";
  }, [searchParams]);

  const sortDirection = useMemo(() => {
    const dir = searchParams.get("dir") as SortDirection;
    return dir === "desc" ? "desc" : "asc";
  }, [searchParams]);

  const view = useMemo(() => {
    const viewParam = searchParams.get("view");
    return viewParam === "rows" ? "rows" : "grid";
  }, [searchParams]);

  // Local state (not URL-synced)
  const [state, dispatch] = useReducer(mediaGridReducer, {
    items: initialItems,
    itemsPerPage: initialItemsPerPage,
  });

  // Actions - Update URL directly
  const updateUrl = useCallback((updates: Record<string, string | null>) => {
    // Skip if not mounted yet
    if (!isMountedRef.current) {
      return;
    }

    // Read current search params from window.location to avoid dependency on searchParams
    const currentQueryString = window.location.search.slice(1);
    const params = new URLSearchParams(currentQueryString);

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    const newQueryString = params.toString();

    // Only update if the URL actually changed
    if (newQueryString !== currentQueryString) {
      const newUrl = newQueryString ? `${pathname}?${newQueryString}` : pathname;
      startTransition(() => {
        router.replace(newUrl as Route, { scroll: false });
      });
    }
  }, [pathname, router, startTransition]);

  const setSearchQuery = useCallback((query: string) => {
    // Only reset page if the search query is actually changing
    const currentQuery = searchQuery;
    if (query === currentQuery) {
      return; // No change, do nothing
    }
    updateUrl({ q: query || null, page: null }); // Reset to page 1 when searching
  }, [updateUrl, searchQuery]);

  const setSortField = useCallback((field: SortField) => {
    // Only reset page if the sort field is actually changing
    if (field === sortField) {
      return; // No change, do nothing
    }
    updateUrl({ sort: field === "title" ? null : field, page: null }); // Reset to page 1 when sorting
  }, [updateUrl, sortField]);

  const setSortDirection = useCallback((direction: SortDirection) => {
    if (direction === sortDirection) {
      return; // No change, do nothing
    }
    updateUrl({ dir: direction === "asc" ? null : direction });
  }, [updateUrl, sortDirection]);

  const toggleSortDirection = useCallback(() => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  }, [sortDirection, setSortDirection]);

  const setView = useCallback((viewMode: "grid" | "rows") => {
    if (viewMode === view) {
      return; // No change, do nothing
    }
    updateUrl({ view: viewMode === "grid" ? null : viewMode });
  }, [updateUrl, view]);

  const setCurrentPage = useCallback((page: number) => {
    if (page === currentPage) {
      return; // No change, do nothing
    }
    updateUrl({ page: page > 1 ? page.toString() : null });
  }, [updateUrl, currentPage]);

  const setItemsPerPage = useCallback((count: number) => {
    dispatch({ type: "SET_ITEMS_PER_PAGE", payload: count });
  }, []);

  // Computed: Filter and Sort (using URL as source of truth)
  const filteredAndSortedItems = useMemo(() => {
    // state.items is Media[]
    let result = [...state.items];

    // Filter
    if (searchQuery && searchQuery.length > 2) {
      const query = searchQuery.toLowerCase();
      result = result.filter((movie) =>
        movie.title.toLowerCase().includes(query)
      );
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;

      if (sortField === "title") {
        comparison = removeArticle(a.title).localeCompare(removeArticle(b.title));
      } else if (sortField === "year") {
        const yearA = a.year || 0;
        const yearB = b.year || 0;
        comparison = yearA - yearB;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

    return result;
  }, [state.items, searchQuery, sortField, sortDirection]);

  // Computed: Paginate (using URL as source of truth)
  const paginatedMovies = useMemo(() => {
    const startIndex = (currentPage - 1) * state.itemsPerPage;
    const endIndex = startIndex + state.itemsPerPage;
    return filteredAndSortedItems.slice(startIndex, endIndex);
  }, [filteredAndSortedItems, currentPage, state.itemsPerPage]);

  // Computed: Total pages
  const totalPages = useMemo(() => {
    return Math.ceil(filteredAndSortedItems.length / state.itemsPerPage);
  }, [filteredAndSortedItems.length, state.itemsPerPage]);

  const value: MediaGridContextValue = useMemo(() => ({
    items: state.items,
    itemsPerPage: state.itemsPerPage,
    // Read from URL
    searchQuery,
    sortField,
    sortDirection,
    view,
    currentPage,
    // Actions
    setSearchQuery,
    setSortField,
    setSortDirection,
    toggleSortDirection,
    setView,
    setCurrentPage,
    setItemsPerPage,
    // Computed
    filteredAndSortedItems,
    paginatedMovies,
    totalPages,
    totalFilteredCount: filteredAndSortedItems.length,
  }), [
    state.items,
    state.itemsPerPage,
    searchQuery,
    sortField,
    sortDirection,
    view,
    currentPage,
    setSearchQuery,
    setSortField,
    setSortDirection,
    toggleSortDirection,
    setView,
    setCurrentPage,
    setItemsPerPage,
    filteredAndSortedItems,
    paginatedMovies,
    totalPages,
  ]);

  return (
    <MediaGridContext.Provider value={value}>
      {children}
    </MediaGridContext.Provider>
  );
}

// Hook
export function useMediaGrid() {
  const context = useContext(MediaGridContext);
  if (!context) {
    throw new Error("useMediaGrid must be used within MediaGridProvider");
  }
  return context;
}

