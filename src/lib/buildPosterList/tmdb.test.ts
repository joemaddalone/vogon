import { describe, it, expect } from "vitest";
import { images } from "./tmdb";

describe("tmdb images", () => {
  it("should process posters and backdrops", async () => {
    const tmdbMedia = {
      images: {
        posters: [
          { file_path: "/path/to/poster1.jpg" },
          { file_path: "/path/to/poster2.jpg" },
        ],
        backdrops: [
          { file_path: "/path/to/backdrop1.jpg" },
          { file_path: "/path/to/backdrop2.jpg" },
        ],
      },
    } as any;

    const result = await images(tmdbMedia);
    expect(result.tmdb_posters).toEqual([
      {
        file_path: "https://image.tmdb.org/t/p/w500//path/to/poster1.jpg",
        source: "tmdb",
      },
      {
        file_path: "https://image.tmdb.org/t/p/w500//path/to/poster2.jpg",
        source: "tmdb",
      },
    ]);
    expect(result.tmdb_backdrops).toEqual([
      {
        file_path: "https://image.tmdb.org/t/p/w500//path/to/backdrop1.jpg",
        source: "tmdb",
      },
      {
        file_path: "https://image.tmdb.org/t/p/w500//path/to/backdrop2.jpg",
        source: "tmdb",
      },
    ]);
  });

  it("should handle empty posters and backdrops", async () => {
    const tmdbMedia = {
      images: {
        posters: [],
        backdrops: [],
      },
    } as any;

    const result = await images(tmdbMedia);
    expect(result.tmdb_posters).toEqual([]);
    expect(result.tmdb_backdrops).toEqual([]);
  });

  it("should handle missing posters", async () => {
    const tmdbMedia = {
      images: {
        backdrops: [{ file_path: "/path/to/backdrop.jpg" }],
      },
    } as any;

    const result = await images(tmdbMedia);
    expect(result.tmdb_posters).toEqual([]);
    expect(result.tmdb_backdrops).toEqual([
      {
        file_path: "https://image.tmdb.org/t/p/w500//path/to/backdrop.jpg",
        source: "tmdb",
      },
    ]);
  });

  it("should handle missing backdrops", async () => {
    const tmdbMedia = {
      images: {
        posters: [{ file_path: "/path/to/poster.jpg" }],
      },
    } as any;

    const result = await images(tmdbMedia);
    expect(result.tmdb_posters).toEqual([
      {
        file_path: "https://image.tmdb.org/t/p/w500//path/to/poster.jpg",
        source: "tmdb",
      },
    ]);
    expect(result.tmdb_backdrops).toEqual([]);
  });
});