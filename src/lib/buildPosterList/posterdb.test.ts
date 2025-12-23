import { describe, it, expect, vi, beforeEach } from "vitest";
import { images } from "./posterdb";

describe("posterdb images", () => {
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      search: vi.fn(),
    };
    vi.clearAllMocks();
  });

  it("should process posters successfully", async () => {
    const mockPosters = [
      { url: "poster1.jpg", optimizedUrl: "opt1.jpg", viewUrl: "view1.jpg" },
      { url: "poster2.jpg", optimizedUrl: null, viewUrl: "view2.jpg" },
    ];
    mockClient.search.mockResolvedValue(mockPosters);

    const options = { title: "Test Movie", year: 2023, itemType: "movie" as any };
    const result = await images(mockClient, options);
    expect(mockClient.search).toHaveBeenCalledWith(options);
    expect(result.theposterdb_posters).toEqual([
      {
        file_path: "poster1.jpg",
        previewUrl: "opt1.jpg",
        source: "theposterdb",
      },
      {
        file_path: "poster2.jpg",
        previewUrl: "view2.jpg",
        source: "theposterdb",
      },
    ]);
  });

  it("should handle empty posters array", async () => {
    mockClient.search.mockResolvedValue([]);

    const options = { title: "Test Movie", year: 2023, itemType: "movie" as any };
    const result = await images(mockClient, options);
    expect(result.theposterdb_posters).toEqual([]);
  });

  it("should handle search error", async () => {
    mockClient.search.mockRejectedValue(new Error("Search failed"));

    const options = { title: "Test Movie", year: 2023, itemType: "movie" as any };
    const result = await images(mockClient, options);
    expect(result.theposterdb_posters).toEqual([]);
  });
});