import { render, cleanup } from "@testing-library/react";
import { Library } from "@/components/library/Library";
import { Media, Selectable } from "@/lib/types";
import { describe, it, expect, vi, afterEach } from "vitest";

// Mock MediaGridContext
vi.mock("@/components/library/MediaGridContext", () => ({
  MediaGridProvider: ({ children }: { children: React.ReactNode; }) => <div>{children}</div>,
}));

// Mock MediaGrid
vi.mock("@/components/library/MediaGrid", () => ({
  MediaGrid: ({ pending, itemType }: { pending: boolean; itemType: string; }) => (
    <div data-testid="media-grid">
      <span data-testid="pending">{pending.toString()}</span>
      <span data-testid="item-type">{itemType}</span>
    </div>
  ),
}));

// Clean up after each test
afterEach(() => {
  cleanup();
});

// Mock the Media type with proper structure
const mockMedia: Selectable<Media> = {
  id: 1,
  title: "Test Movie",
  ratingKey: "1",
  thumbUrl: "https://example.com/poster.jpg",
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
  type: 1, // MediaTypeEnum.MOVIE
  serverId: 1,
};

describe("Library", () => {
  it("should render MediaGrid with correct props for movies", () => {
    const items = [mockMedia];

    const { getByTestId } = render(
      <Library
        items={items}
        pending={false}
        type="movie"
      />
    );

    expect(getByTestId("media-grid")).toBeDefined();
    expect(getByTestId("pending").textContent).toBe("false");
    expect(getByTestId("item-type").textContent).toBe("movie");
  });

  it("should render MediaGrid with correct props for shows", () => {
    const items = [mockMedia];

    const { getByTestId } = render(
      <Library
        items={items}
        pending={true}
        type="show"
      />
    );

    expect(getByTestId("media-grid")).toBeDefined();
    expect(getByTestId("pending").textContent).toBe("true");
    expect(getByTestId("item-type").textContent).toBe("show");
  });

  it("should wrap MediaGrid with MediaGridProvider", () => {
    const items = [mockMedia];

    const { getByTestId } = render(
      <Library
        items={items}
        pending={false}
        type="movie"
      />
    );

    // MediaGrid should be rendered inside the provider
    expect(getByTestId("media-grid")).toBeDefined();
  });

  it("should handle empty items array", () => {
    const items: Selectable<Media>[] = [];

    const { getByTestId } = render(
      <Library
        items={items}
        pending={false}
        type="movie"
      />
    );

    expect(getByTestId("media-grid")).toBeDefined();
  });
});