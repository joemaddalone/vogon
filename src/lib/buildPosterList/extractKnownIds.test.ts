import { describe, it, expect } from "vitest";
import { extractKnownIds } from "./extractKnownIds";

describe("extractKnownIds", () => {
  it("should extract tmdb, imdb, and tvdb ids from guid array", () => {
    const guid = [
      { id: "tmdb://123" },
      { id: "imdb://tt1234567" },
      { id: "tvdb://456" },
    ];
    const result = extractKnownIds(guid);
    expect(result).toEqual({
      tmdb: "123",
      imdb: "tt1234567",
      tvdb: "456",
    });
  });

  it("should handle missing ids", () => {
    const guid = [{ id: "tmdb://123" }];
    const result = extractKnownIds(guid);
    expect(result).toEqual({
      tmdb: "123",
      imdb: undefined,
      tvdb: undefined,
    });
  });

  it("should return empty strings if no matching prefixes", () => {
    const guid = [{ id: "other://789" }];
    const result = extractKnownIds(guid);
    expect(result).toEqual({
      tmdb: undefined,
      imdb: undefined,
      tvdb: undefined,
    });
  });

  it("should handle multiple entries and pick the first match", () => {
    const guid = [
      { id: "tmdb://123" },
      { id: "tmdb://789" },
      { id: "imdb://tt1234567" },
    ];
    const result = extractKnownIds(guid);
    expect(result).toEqual({
      tmdb: "123",
      imdb: "tt1234567",
      tvdb: undefined,
    });
  });

  it("should handle empty guid array", () => {
    const guid: Record<string, string>[] = [];
    const result = extractKnownIds(guid);
    expect(result).toEqual({
      tmdb: undefined,
      imdb: undefined,
      tvdb: undefined,
    });
  });
});