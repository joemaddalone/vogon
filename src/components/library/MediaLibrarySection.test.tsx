import { render, screen, fireEvent, cleanup, act } from "@testing-library/react";
import { MediaLibrarySection } from "@/components/library/MediaLibrarySection";
import { Media, ApiResponse } from "@/lib/types";
import { describe, it, expect, vi, afterEach } from "vitest";

// Mock useRouter
const mockRouter = {
  refresh: vi.fn(),
};
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => mockRouter),
}));


// Mock Library component
vi.mock("@/components/library/Library", () => ({
  Library: ({ items, type }: { items: Media[]; type: string; }) => (
    <div data-testid="library" data-type={type}>
      {items.map((item) => (
        <div key={Math.random()} data-testid="media-item">{item.title}</div>
      ))}
    </div>
  ),
}));

// Mock LibraryError component
vi.mock("@/components/library/LibraryError", () => ({
  LibraryError: ({ error }: { error: string; }) => (
    <div data-testid="library-error">{error}</div>
  ),
}));

// Mock api
vi.mock("@/lib/api", () => ({
  api: {
    data: {
      plex: {
        resetMovies: vi.fn(),
        resetShows: vi.fn(),
      },
    },
  },
}));

// Import the mocked api
import { api } from "@/lib/api";

afterEach(() => {
  cleanup();
  vi.resetAllMocks();
});

// Mock media data
const mockMedia: Media = {
  // @ts-ignore
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
  // @ts-ignore
  type: 1,
  // @ts-ignore
  serverId: 1,
};

const createLibLoader = (data: Media[] | null = null, error: string | null = null): Promise<ApiResponse<Media[]>> => {
  return Promise.resolve({
    data: data || [],
    error: error ? new Error(error) : undefined,
  });
};

describe("MediaLibrarySection", () => {
  it("should render Library component with data for movies", async () => {
    const libLoader = createLibLoader([mockMedia]);

    await act(async () => {
      render(<MediaLibrarySection libLoader={libLoader} type="movie" />);
    });

    expect(screen.getByTestId("library")).toBeDefined();
    expect(screen.getByTestId("library").getAttribute("data-type")).toBe("movie");
    expect(screen.getByTestId("media-item")).toHaveTextContent("Test Movie");
  });

  it("should render Library component with data for shows", async () => {
    const libLoader = createLibLoader([mockMedia]);

    await act(async () => {
      render(<MediaLibrarySection libLoader={libLoader} type="show" />);
    });

    expect(screen.getByTestId("library")).toBeDefined();
    expect(screen.getByTestId("library").getAttribute("data-type")).toBe("show");
  });

  it("should render LibraryError when there is an error", async () => {
    const libLoader = createLibLoader(null, "Test error");

    await act(async () => {
      render(<MediaLibrarySection libLoader={libLoader} type="movie" />);
    });

    expect(screen.getByTestId("library-error")).toHaveTextContent("Test error");
  });

  it("should show reset button when data length > 0", async () => {
    const libLoader = createLibLoader([mockMedia]);

    await act(async () => {
      render(<MediaLibrarySection libLoader={libLoader} type="movie" />);
    });

    expect(screen.getByRole("button", { name: "common.emptyLibrary" })).toBeDefined();
  });

  it("should not show reset button when data is empty", async () => {
    const libLoader = createLibLoader([]);

    await act(async () => {
      render(<MediaLibrarySection libLoader={libLoader} type="movie" />);
    });

    expect(screen.queryByRole("button", { name: "common.emptyLibrary" })).toBeNull();
  });

  it("should call resetMovies and refresh router on reset button click for movies", async () => {
    const libLoader = createLibLoader([mockMedia]);
    const resetMoviesMock = vi.fn().mockResolvedValue(undefined);
    api.data.plex.resetMovies = resetMoviesMock;

    await act(async () => {
      render(<MediaLibrarySection libLoader={libLoader} type="movie" />);
    });

    const button = screen.getByRole("button", { name: "common.emptyLibrary" });
    await act(async () => {
      fireEvent.click(button);
    });

    expect(resetMoviesMock).toHaveBeenCalled();
    expect(mockRouter.refresh).toHaveBeenCalled();
  });

  it("should call resetShows and refresh router on reset button click for shows", async () => {
    const libLoader = createLibLoader([mockMedia]);
    const resetShowsMock = vi.fn().mockResolvedValue(undefined);
    api.data.plex.resetShows = resetShowsMock;

    await act(async () => {
      render(<MediaLibrarySection libLoader={libLoader} type="show" />);
    });

    const button = screen.getByRole("button", { name: "common.emptyLibrary" });
    await act(async () => {
      fireEvent.click(button);
    });

    expect(resetShowsMock).toHaveBeenCalled();
    expect(mockRouter.refresh).toHaveBeenCalled();
  });

  it("should not refresh router when reset fails", async () => {
    const libLoader = createLibLoader([mockMedia]);
    const resetMoviesMock = vi.fn().mockRejectedValue(new Error("Reset failed"));
    api.data.plex.resetMovies = resetMoviesMock;

    await act(async () => {
      render(<MediaLibrarySection libLoader={libLoader} type="movie" />);
    });

    const button = screen.getByRole("button", { name: "common.emptyLibrary" });
    await act(async () => {
      fireEvent.click(button);
    });

    expect(resetMoviesMock).toHaveBeenCalled();
    expect(mockRouter.refresh).not.toHaveBeenCalled();
  });
});

it("should render Library component with data for shows", async () => {
  const libLoader = createLibLoader([mockMedia]);

  await act(async () => {
    render(<MediaLibrarySection libLoader={libLoader} type="show" />);
  });

  expect(screen.getByTestId("library")).toBeDefined();
  expect(screen.getByTestId("library").getAttribute("data-type")).toBe("show");
});

it("should render LibraryError when there is an error", async () => {
  const libLoader = createLibLoader(null, "Test error");

  await act(async () => {
    render(<MediaLibrarySection libLoader={libLoader} type="movie" />);
  });

  expect(screen.getByTestId("library-error")).toHaveTextContent("Test error");
});

it("should show reset button when data length > 0", async () => {
  const libLoader = createLibLoader([mockMedia]);

  await act(async () => {
    render(<MediaLibrarySection libLoader={libLoader} type="movie" />);
  });

  expect(screen.getByRole("button", { name: "common.emptyLibrary" })).toBeDefined();
});

it("should not show reset button when data is empty", async () => {
  const libLoader = createLibLoader([]);

  await act(async () => {
    render(<MediaLibrarySection libLoader={libLoader} type="movie" />);
  });

  expect(screen.queryByRole("button", { name: "common.emptyLibrary" })).toBeNull();
});

it("should call resetMovies and refresh router on reset button click for movies", async () => {
  const libLoader = createLibLoader([mockMedia]);
  const resetMoviesMock = vi.fn().mockResolvedValue(undefined);
  api.data.plex.resetMovies = resetMoviesMock;

  await act(async () => {
    render(<MediaLibrarySection libLoader={libLoader} type="movie" />);
  });

  const button = screen.getByRole("button", { name: "common.emptyLibrary" });
  await act(async () => {
    fireEvent.click(button);
  });

  expect(resetMoviesMock).toHaveBeenCalled();
  expect(mockRouter.refresh).toHaveBeenCalled();
});

it("should call resetShows and refresh router on reset button click for shows", async () => {
  const libLoader = createLibLoader([mockMedia]);
  const resetShowsMock = vi.fn().mockResolvedValue(undefined);
  api.data.plex.resetShows = resetShowsMock;

  await act(async () => {
    render(<MediaLibrarySection libLoader={libLoader} type="show" />);
  });

  const button = screen.getByRole("button", { name: "common.emptyLibrary" });
  await act(async () => {
    fireEvent.click(button);
  });

  expect(resetShowsMock).toHaveBeenCalled();
  expect(mockRouter.refresh).toHaveBeenCalled();
});

it("should not refresh router when reset fails", async () => {
  const libLoader = createLibLoader([mockMedia]);
  const resetMoviesMock = vi.fn().mockRejectedValue(new Error("Reset failed"));
  api.data.plex.resetMovies = resetMoviesMock;

  await act(async () => {
    render(<MediaLibrarySection libLoader={libLoader} type="movie" />);
  });

  const button = screen.getByRole("button", { name: "common.emptyLibrary" });
  await act(async () => {
    fireEvent.click(button);
  });

  expect(resetMoviesMock).toHaveBeenCalled();
  expect(mockRouter.refresh).not.toHaveBeenCalled();
});
