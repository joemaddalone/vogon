import { render, fireEvent, cleanup } from "@testing-library/react";
import { MediaGridControl } from "@/components/library/MediaGridControl";
import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";

// Mock dependencies
vi.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, variant, size, ...props }: any) => (
    <button
      onClick={onClick}
      data-variant={variant}
      data-size={size}
      data-testid="button"
      {...props}
    >
      {children}
    </button>
  ),
}));

vi.mock("@/components/ui/button-group", () => ({
  ButtonGroup: ({ children, className }: { children: React.ReactNode; className: string; }) => (
    <div className={className} data-testid="button-group">
      {children}
    </div>
  ),
}));

vi.mock("@/components/library/SearchField", () => ({
  SearchField: ({ searchQuery, setSearchQuery }: any) => (
    <input
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      data-testid="search-field"
    />
  ),
}));

vi.mock("next-intl", () => ({
  useTranslations: vi.fn(() => (key: string) => key),
}));

// Mock values and functions
const mockSetSearchQuery = vi.fn();
const mockSetView = vi.fn();
const mockSetSortField = vi.fn();
const mockToggleSortDirection = vi.fn();

// Mock useMediaGrid hook - must be top level
vi.mock("@/components/library/MediaGridContext", () => ({
  useMediaGrid: () => ({
    view: "grid",
    searchQuery: "",
    sortField: "title",
    sortDirection: "asc",
    setView: mockSetView,
    setSearchQuery: mockSetSearchQuery,
    setSortField: mockSetSortField,
    toggleSortDirection: mockToggleSortDirection,
  }),
}));

describe("MediaGridControl", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("should render search field", () => {
    const { getByTestId } = render(<MediaGridControl />);

    expect(getByTestId("search-field")).toBeDefined();
  });

  it("should render sort controls", () => {
    const { getAllByTestId, getByTestId } = render(<MediaGridControl />);

    const buttonGroups = getAllByTestId("button-group");
    expect(buttonGroups.length).toBeGreaterThan(0);
    expect(getByTestId("sort-title")).toBeDefined();
    expect(getByTestId("sort-release-date")).toBeDefined();
  });

  it("should render view controls", () => {
    const { getAllByTestId, getByTestId } = render(<MediaGridControl />);

    const buttonGroups = getAllByTestId("button-group");
    expect(buttonGroups.length).toBe(2); // Sort and view controls
    expect(getByTestId("view-grid")).toBeDefined();
    expect(getByTestId("view-rows")).toBeDefined();
  });

  it("should highlight active sort field", () => {
    const { getByTestId } = render(<MediaGridControl />);

    const titleButton = getByTestId("sort-title");
    const releaseDateButton = getByTestId("sort-release-date");

    // data-variant is on the button itself in the mock
    expect(titleButton.getAttribute("data-variant")).toBe("default");
    expect(releaseDateButton.getAttribute("data-variant")).toBe("outline");
  });

  it("should highlight active view mode", () => {
    const { getByTestId } = render(<MediaGridControl />);

    const gridButton = getByTestId("view-grid");
    const rowsButton = getByTestId("view-rows");

    // data-variant is on the button itself in the mock
    expect(gridButton.getAttribute("data-variant")).toBe("default");
    expect(rowsButton.getAttribute("data-variant")).toBe("outline");
  });

  it("should toggle sort direction when same sort field is clicked", () => {
    const { getByTestId } = render(<MediaGridControl />);

    const titleButton = getByTestId("sort-title");
    fireEvent.click(titleButton);

    expect(mockToggleSortDirection).toHaveBeenCalled();
  });

  it("should change sort field when different sort field is clicked", () => {
    const { getByTestId } = render(<MediaGridControl />);

    const releaseDateButton = getByTestId("sort-release-date");
    fireEvent.click(releaseDateButton);

    expect(mockSetSortField).toHaveBeenCalledWith("releaseDate");
  });

  it("should change view mode when view button is clicked", () => {
    const { getByTestId } = render(<MediaGridControl />);

    const rowsButton = getByTestId("view-rows");
    fireEvent.click(rowsButton);

    expect(mockSetView).toHaveBeenCalledWith("rows");
  });
});