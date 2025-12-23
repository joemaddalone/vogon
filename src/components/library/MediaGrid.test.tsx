import { render, cleanup } from "@testing-library/react";
import { MediaGrid } from "@/components/library/MediaGrid";
import { describe, it, expect, vi, afterEach } from "vitest";

// Mock dependencies
vi.mock("@/components/library/MediaWidget", () => ({
  MediaWidget: ({ itemType, movieData, mode }: any) => (
    <div data-testid="media-widget" data-item-type={itemType} data-mode={mode}>
      {movieData.title}
    </div>
  ),
}));

vi.mock("@/components/library/MediaGridControl", () => ({
  MediaGridControl: () => <div data-testid="media-grid-control" />,
}));

vi.mock("@/components/library/PaginationControls", () => ({
  PaginationControls: () => <div data-testid="pagination-controls" />,
}));

vi.mock("@/components/ui/spinner", () => ({
  Spinner: ({ className }: any) => <div className={className} data-testid="spinner" />,
}));

// Mock the useMediaGrid hook to provide controlled values
vi.mock("@/components/library/MediaGridContext", () => ({
  useMediaGrid: vi.fn(() => ({
    paginatedMovies: [
      { id: 1, title: "Movie 1" },
      { id: 2, title: "Movie 2" },
    ],
    view: "grid",
    totalFilteredCount: 10,
    items: [],
  })),
}));

afterEach(() => {
  cleanup();
  vi.resetAllMocks();
});

describe("MediaGrid", () => {
  it("should render control components", () => {
    const { queryAllByTestId } = render(<MediaGrid pending={false} itemType="movie" />);

    expect(queryAllByTestId("media-grid-control")).toBeDefined();
    const paginationControls = queryAllByTestId("pagination-controls");
    expect(paginationControls).toHaveLength(2);
  });


  it("should render spinner when pending", () => {
    const { getByTestId } = render(<MediaGrid pending={true} itemType="movie" />);

    expect(getByTestId("spinner")).toBeDefined();
    expect(getByTestId("spinner").classList.contains("text-gray-500")).toBe(true);
  });

  it("should render empty state when no items", () => {
    vi.doMock("@/components/library/MediaGridContext", () => ({
      useMediaGrid: vi.fn(() => ({
        paginatedMovies: [],
        view: "grid",
        totalFilteredCount: 0,
        items: [],
      })),
    }));

    const { getByTestId } = render(<MediaGrid pending={false} itemType="movie" />);

    expect(getByTestId("empty-state")).toBeDefined();
  });

  it("should render empty library state correctly", () => {
    // This test verifies that the empty library message is rendered
    const { getByTestId } = render(<MediaGrid pending={false} itemType="movie" />);

    // Should show some empty state message (the exact one depends on component logic)
    expect(getByTestId("empty-state")).toBeDefined();
  });

  it("should render pagination controls twice when items exist", () => {
    const { queryAllByTestId } = render(<MediaGrid pending={false} itemType="movie" />);

    const paginationControls = queryAllByTestId("pagination-controls");
    expect(paginationControls).toHaveLength(2); // One at top, one at bottom
  });
});