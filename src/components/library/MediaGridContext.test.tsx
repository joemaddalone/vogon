import { render, renderHook, cleanup } from "@testing-library/react";
import { MediaGridProvider, useMediaGrid } from "@/components/library/MediaGridContext";
import { Media, Selectable } from "@/lib/types";
import { ReactNode } from "react";
import { useSearchParams, ReadonlyURLSearchParams } from "next/navigation";
import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";


afterEach(() => {
  cleanup();
  vi.resetAllMocks();
});

describe("MediaGridContext", () => {
  let mockMedia: Selectable<Media>[];

  beforeEach(() => {
    mockMedia = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      title: `Test Media ${String(i + 1).padStart(2, "0")}`,
      ratingKey: `${i + 1}`,
      thumbUrl: null,
      releaseDate: "2023-01-01",
      year: 2023,
      artUrl: null,
      contentRating: null,
      duration: null,
      guid: null,
      index: null,
      libraryKey: null,
      parentIndex: null,
      parentKey: null,
      parentRatingKey: null,
      parentTheme: null,
      parentThumb: null,
      parentTitle: null,
      rating: null,
      summary: null,
      type: 1,
      serverId: 1,
    }));
  });

  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it("should provide default values from URL params", () => {
    const mockUseSearchParams = vi.mocked(useSearchParams);
    mockUseSearchParams.mockReturnValue(new URLSearchParams("page=2&q=test&sort=releaseDate&dir=desc&view=rows") as unknown as ReadonlyURLSearchParams);

    const wrapper = ({ children }: { children: ReactNode; }) => (
      <MediaGridProvider initialItems={mockMedia}>
        {children}
      </MediaGridProvider>
    );

    const { result } = renderHook(() => useMediaGrid(), { wrapper });

    expect(result.current.currentPage).toBe(2);
    expect(result.current.searchQuery).toBe("test");
    expect(result.current.sortField).toBe("releaseDate");
    expect(result.current.sortDirection).toBe("desc");
    expect(result.current.view).toBe("rows");
  });

  it("should provide default values when no URL params", () => {
    const mockUseSearchParams = vi.mocked(useSearchParams);
    mockUseSearchParams.mockReturnValue(new URLSearchParams() as unknown as ReadonlyURLSearchParams);

    const wrapper = ({ children }: { children: ReactNode; }) => (
      <MediaGridProvider initialItems={mockMedia}>
        {children}
      </MediaGridProvider>
    );

    const { result } = renderHook(() => useMediaGrid(), { wrapper });

    expect(result.current.currentPage).toBe(1);
    expect(result.current.searchQuery).toBe("");
    expect(result.current.sortField).toBe("title");
    expect(result.current.sortDirection).toBe("asc");
    expect(result.current.view).toBe("grid");
  });

  it("should filter items based on search query", () => {
    const mockUseSearchParams = vi.mocked(useSearchParams);
    mockUseSearchParams.mockReturnValue(new URLSearchParams("q=Media 03") as unknown as ReadonlyURLSearchParams);

    const wrapper = ({ children }: { children: ReactNode; }) => (
      <MediaGridProvider initialItems={mockMedia}>
        {children}
      </MediaGridProvider>
    );

    const { result } = renderHook(() => useMediaGrid(), { wrapper });

    expect(result.current.filteredAndSortedItems).toHaveLength(1);
    expect(result.current.filteredAndSortedItems[0].title).toBe("Test Media 03");
  });

  it("should sort items by title", () => {
    const mockUseSearchParams = vi.mocked(useSearchParams);
    mockUseSearchParams.mockReturnValue(new URLSearchParams("sort=title&dir=asc") as unknown as ReadonlyURLSearchParams);

    const wrapper = ({ children }: { children: ReactNode; }) => (
      <MediaGridProvider initialItems={mockMedia}>
        {children}
      </MediaGridProvider>
    );

    const { result } = renderHook(() => useMediaGrid(), { wrapper });

    expect(result.current.filteredAndSortedItems[0].title).toBe("Test Media 01");
    expect(result.current.filteredAndSortedItems[9].title).toBe("Test Media 10");
  });

  it("should sort items by title descending", () => {
    const mockUseSearchParams = vi.mocked(useSearchParams);
    mockUseSearchParams.mockReturnValue(new URLSearchParams("sort=title&dir=desc") as unknown as ReadonlyURLSearchParams);

    const wrapper = ({ children }: { children: ReactNode; }) => (
      <MediaGridProvider initialItems={mockMedia}>
        {children}
      </MediaGridProvider>
    );

    const { result } = renderHook(() => useMediaGrid(), { wrapper });

    expect(result.current.filteredAndSortedItems[0].title).toBe("Test Media 10");
    expect(result.current.filteredAndSortedItems[9].title).toBe("Test Media 01");
  });

  it("should sort items by release date", () => {
    const mockUseSearchParams = vi.mocked(useSearchParams);
    mockUseSearchParams.mockReturnValue(new URLSearchParams("sort=releaseDate&dir=asc") as unknown as ReadonlyURLSearchParams);

    // Create media with different release dates
    const mediaWithDates = [
      { ...mockMedia[0], title: "Media A", releaseDate: "2023-01-01" },
      { ...mockMedia[1], title: "Media B", releaseDate: "2023-02-01" },
      { ...mockMedia[2], title: "Media C", releaseDate: "2023-03-01" },
    ];

    const wrapper = ({ children }: { children: ReactNode; }) => (
      <MediaGridProvider initialItems={mediaWithDates}>
        {children}
      </MediaGridProvider>
    );

    const { result } = renderHook(() => useMediaGrid(), { wrapper });

    expect(result.current.filteredAndSortedItems[0].title).toBe("Media A");
    expect(result.current.filteredAndSortedItems[1].title).toBe("Media B");
    expect(result.current.filteredAndSortedItems[2].title).toBe("Media C");
  });

  it("should paginate items correctly", () => {
    const mockUseSearchParams = vi.mocked(useSearchParams);
    mockUseSearchParams.mockReturnValue(new URLSearchParams("page=2") as unknown as ReadonlyURLSearchParams);

    const wrapper = ({ children }: { children: ReactNode; }) => (
      <MediaGridProvider initialItems={mockMedia} initialItemsPerPage={3}>
        {children}
      </MediaGridProvider>
    );

    const { result } = renderHook(() => useMediaGrid(), { wrapper });

    expect(result.current.paginatedMovies).toHaveLength(3);
    expect(result.current.paginatedMovies[0].title).toBe("Test Media 04");
    expect(result.current.paginatedMovies[2].title).toBe("Test Media 06");
  });

  it("should calculate total pages correctly", () => {
    const mockUseSearchParams = vi.mocked(useSearchParams);
    mockUseSearchParams.mockReturnValue(new URLSearchParams() as unknown as ReadonlyURLSearchParams);

    const wrapper = ({ children }: { children: ReactNode; }) => (
      <MediaGridProvider initialItems={mockMedia} initialItemsPerPage={3}>
        {children}
      </MediaGridProvider>
    );

    const { result } = renderHook(() => useMediaGrid(), { wrapper });

    expect(result.current.totalPages).toBe(4); // 10 items / 3 per page = 3.33 → 4 pages
  });

  it("should handle articles removal for title sorting", () => {
    const mockUseSearchParams = vi.mocked(useSearchParams);
    mockUseSearchParams.mockReturnValue(new URLSearchParams("sort=title&dir=asc") as unknown as ReadonlyURLSearchParams);

    const mediaWithArticles = [
      { ...mockMedia[0], title: "The Matrix" },
      { ...mockMedia[1], title: "A Beautiful Mind" },
      { ...mockMedia[2], title: "An Inception" },
      { ...mockMedia[3], title: "Avatar" },
    ];

    const wrapper = ({ children }: { children: ReactNode; }) => (
      <MediaGridProvider initialItems={mediaWithArticles}>
        {children}
      </MediaGridProvider>
    );

    const { result } = renderHook(() => useMediaGrid(), { wrapper });

    // Should sort ignoring articles: Avatar, Inception, Matrix, Beautiful Mind
    expect(result.current.filteredAndSortedItems[0].title).toBe("Avatar");
    expect(result.current.filteredAndSortedItems[1].title).toBe("A Beautiful Mind");
    expect(result.current.filteredAndSortedItems[2].title).toBe("An Inception");
    expect(result.current.filteredAndSortedItems[3].title).toBe("The Matrix");
  });

  it("should throw error when useMediaGrid is used outside provider", () => {
    // Suppress console.error for this specific test as React will log the error
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => { });

    expect(() => renderHook(() => useMediaGrid())).toThrow("useMediaGrid must be used within MediaGridProvider");

    consoleSpy.mockRestore();
  });

  it("should render children correctly", () => {
    const mockUseSearchParams = vi.mocked(useSearchParams);
    mockUseSearchParams.mockReturnValue(new URLSearchParams() as unknown as ReadonlyURLSearchParams);

    const TestChild = () => {
      const { items } = useMediaGrid();
      return <div data-testid="child">{items.length} items</div>;
    };

    const { getByTestId } = render(
      <MediaGridProvider initialItems={mockMedia}>
        <TestChild />
      </MediaGridProvider>
    );

    expect(getByTestId("child")).toHaveTextContent("10 items");
  });
});