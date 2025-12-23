/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, cleanup } from "@testing-library/react";
import { MediaWidget } from "@/components/library/MediaWidget";
import { Selectable, Media } from "@/lib/types";
import { describe, it, expect, vi, afterEach } from "vitest";

// Mock dependencies
vi.mock("@/components/ImageLoader", () => ({
  default: ({ src, alt, className }: any) => (
    <img src={src} alt={alt} className={className} data-testid="image-loader" />
  ),
}));

vi.mock("next/link", () => ({
  default: ({ children, href, scroll, ...props }: any) => (
    <a href={href} data-testid="link" {...props}>
      {children}
    </a>
  ),
}));

vi.mock("motion/react", () => ({
  motion: {
    div: ({ children, layout, ...props }: any) => <div data-testid="motion-div" {...props}>{children}</div>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
}));

afterEach(() => {
  cleanup();
});

describe("MediaWidget", () => {
  const mockMovieData: Selectable<Media> = {
    id: 1,
    title: "Test Movie",
    ratingKey: "123",
    thumbUrl: "https://example.com/poster.jpg",
    releaseDate: "2023-01-01",
    year: 2023,
    summary: "Test movie summary",
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
    type: 1, // Movie
    serverId: 1,
  };

  it("should render movie widget with poster", () => {
    const { getByTestId } = render(
      <MediaWidget
        movieData={mockMovieData}
        itemType="movie"
      />
    );

    const link = getByTestId("link");
    expect(link.getAttribute("href")).toBe("/movie/123");

    const image = getByTestId("image-loader");
    expect(image.getAttribute("src")).toBe("https://example.com/poster.jpg");
    expect(image.getAttribute("alt")).toBe("Test Movie poster");
  });

  it("should render show widget", () => {
    const { getByTestId } = render(
      <MediaWidget
        movieData={mockMovieData}
        itemType="show"
      />
    );

    const link = getByTestId("link");
    expect(link.getAttribute("href")).toBe("/show/123");
  });

  it("should render title", () => {
    const { getByText } = render(
      <MediaWidget
        movieData={mockMovieData}
        itemType="movie"
      />
    );

    expect(getByText("Test Movie")).toBeDefined();
  });

  it("should render summary in grid mode on hover", () => {
    const { getByTestId, getByText } = render(
      <MediaWidget
        movieData={mockMovieData}
        itemType="movie"
        mode="grid"
      />
    );

    const motionDiv = getByTestId("motion-div");
    expect(motionDiv.classList.contains("group")).toBe(true);

    const overview = getByText("Test movie summary");
    expect(overview.parentElement?.classList.contains("group-hover:opacity-100")).toBe(true);
  });

  it("should render summary in rows mode", () => {
    const { getByText } = render(
      <MediaWidget
        movieData={mockMovieData}
        itemType="movie"
        mode="rows"
      />
    );

    expect(getByText("Test movie summary")).toBeDefined();
  });

  it("should render fallback when no poster is available", () => {
    const movieWithoutPoster = { ...mockMovieData, thumbUrl: null };

    const { getByText, getByTestId } = render(
      <MediaWidget
        movieData={movieWithoutPoster}
        itemType="movie"
      />
    );

    expect(getByText("library.noPosterAvailable")).toBeDefined();
    expect(() => getByTestId("image-loader")).toThrow();
  });

  it("should apply custom className", () => {
    const { getByTestId } = render(
      <MediaWidget
        movieData={mockMovieData}
        itemType="movie"
        className="custom-class"
      />
    );

    const link = getByTestId("link");
    expect(link.classList.contains("custom-class")).toBe(true);
  });

  it("should truncate long summary in grid mode", () => {
    const movieWithLongSummary = {
      ...mockMovieData,
      summary: "This is a very long summary that should be truncated when it exceeds the maximum length of 250 characters. ".repeat(3)
    };

    const { getByText } = render(
      <MediaWidget
        movieData={movieWithLongSummary}
        itemType="movie"
        mode="grid"
      />
    );

    const overviewText = getByText(/This is a very long summary that should be truncated/);
    expect(overviewText.textContent?.length).toBeLessThan(254); // 250 + "..."
    expect(overviewText.textContent?.endsWith("...")).toBe(true);
  });

  it("should render with default grid mode", () => {
    const { getByTestId } = render(
      <MediaWidget
        movieData={mockMovieData}
        itemType="movie"
      />
    );

    const motionDiv = getByTestId("motion-div");
    expect(motionDiv.classList.contains("group")).toBe(true);
  });

  it("should render with widget-block class", () => {
    const { getByTestId } = render(
      <MediaWidget
        movieData={mockMovieData}
        itemType="movie"
      />
    );

    const link = getByTestId("link");
    expect(link.classList.contains("widget-block")).toBe(true);
  });
});