/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { TMDBWithFind } from "./tmdb";
import { getClients } from "./getClients";

vi.mock("./getClients");
vi.mock("@lorenzopant/tmdb");

global.fetch = vi.fn();

describe("TMDBWithFind", () => {
  let tmdb: TMDBWithFind;

  beforeEach(() => {
    vi.clearAllMocks();
    tmdb = new TMDBWithFind("api-key");
    (getClients as any).mockResolvedValue({
      tmdbApiKey: "bearer-token",
    });
  });

  describe("find", () => {
    it("should find movies by external id", async () => {
      const mockData = { movie_results: [{ id: 123, title: "Movie" }] };
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: () => mockData,
      });

      const result = await tmdb.find("tt123", "imdb_id");
      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.themoviedb.org/3/find/tt123?external_source=imdb_id",
        {
          headers: {
            Authorization: "Bearer bearer-token",
            "Content-Type": "application/json;charset=utf-8",
          },
        }
      );
      expect(result).toEqual([{ id: 123, title: "Movie" }]);
    });

    it("should return empty array on error", async () => {
      (global.fetch as any).mockResolvedValue({ ok: false, status: 404 });

      const result = await tmdb.find("tt123", "imdb_id");
      expect(result).toEqual([]);
    });
  });

  describe("shows.details", () => {
    it("should get show details", async () => {
      const mockData = { id: 456, name: "Show", images: { posters: [], backdrops: [] } };
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: () => mockData,
      });

      const result = await tmdb.shows.details("456");
      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.themoviedb.org/3/tv/456?append_to_response=images",
        {
          headers: {
            Authorization: "Bearer bearer-token",
            "Content-Type": "application/json;charset=utf-8",
          },
        }
      );
      expect(result).toEqual(mockData);
    });

    it("should return null on error", async () => {
      (global.fetch as any).mockResolvedValue({ ok: false, status: 404 });

      const result = await tmdb.shows.details("456");
      expect(result).toBeNull();
    });
  });

  describe("seasons.details", () => {
    it("should get season details", async () => {
      const mockData = { id: 789, season_number: 1, images: { posters: [], backdrops: [] } };
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: () => mockData,
      });

      const result = await tmdb.seasons.details("789", 1);
      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.themoviedb.org/3/tv/789/season/1?append_to_response=images",
        {
          headers: {
            Authorization: "Bearer bearer-token",
            "Content-Type": "application/json;charset=utf-8",
          },
        }
      );
      expect(result).toEqual(mockData);
    });

    it("should return null on error", async () => {
      (global.fetch as any).mockResolvedValue({ ok: false, status: 404 });

      const result = await tmdb.seasons.details("789", 1);
      expect(result).toBeNull();
    });
  });
});