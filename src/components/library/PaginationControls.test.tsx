import { render, cleanup } from "@testing-library/react";
import { PaginationControls } from "@/components/library/PaginationControls";
import { describe, it, expect, vi, afterEach } from "vitest";

// Mock dependencies
vi.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, disabled, ...props }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      data-testid="button"
      {...props}
    >
      {children}
    </button>
  ),
}));

vi.mock("@/components/FadeIn", () => ({
  FadeIn: ({ children, className }: { children: React.ReactNode; className: string; }) => (
    <div className={className} data-testid="fade-in">
      {children}
    </div>
  ),
}));

// Mock useMediaGrid hook
vi.mock("@/components/library/MediaGridContext", () => ({
  useMediaGrid: vi.fn(() => ({
    currentPage: 2,
    totalPages: 5,
    setCurrentPage: vi.fn(),
    totalFilteredCount: 48,
    itemsPerPage: 12,
  })),
}));

afterEach(() => {
  cleanup();
  vi.resetAllMocks();
});

describe("PaginationControls", () => {
  it.skip("should render pagination controls when totalPages > 1", () => {
    const { getByTestId, getByText } = render(<PaginationControls />);

    expect(getByTestId("fade-in")).toBeDefined();
    expect(getByText("library.showing")).toBeDefined();
  });

  it("should render navigation buttons", () => {
    const { getByLabelText } = render(<PaginationControls />);

    expect(getByLabelText("library.firstPage")).toBeDefined();
    expect(getByLabelText("library.previousPage")).toBeDefined();
    expect(getByLabelText("library.nextPage")).toBeDefined();
    expect(getByLabelText("library.lastPage")).toBeDefined();
  });

  it("should display correct item range", () => {
    const { getByText } = render(<PaginationControls />);

    expect(getByText("13")).toBeDefined(); // startItem = (2-1)*12+1
    expect(getByText("24")).toBeDefined(); // endItem = min(2*12, 48)
    expect(getByText("48")).toBeDefined(); // totalFilteredCount
  });

  it("should render page numbers", () => {
    const { getByText } = render(<PaginationControls />);

    // Should show page numbers including current page
    expect(getByText("1")).toBeDefined();
    expect(getByText("2")).toBeDefined();
    expect(getByText("3")).toBeDefined();
    expect(getByText("4")).toBeDefined();
    expect(getByText("5")).toBeDefined();
  });

  it("should show mobile page indicator", () => {
    const { getByText } = render(<PaginationControls />);

    const mobileIndicator = getByText(/library.page \d+ library.of \d+/);
    expect(mobileIndicator).toBeDefined();
  });
});