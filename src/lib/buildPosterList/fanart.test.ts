import { describe, it, expect, vi, beforeEach } from "vitest";
import * as fanart from "./fanart";
import { api } from "@/lib/api";

vi.mock("@/lib/api", () => ({
  api: {
    fanart: {
      moviePosters: vi.fn(),
      showPosters: vi.fn(),
    },
  },
}));

describe("fanart", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("movie", () => {
    it("should process movie posters, logos, and backdrops", async () => {
      const mockResponse = {
        movieposter: [
          { url: "poster1.jpg", lang: "en" },
          { url: "poster2.jpg", lang: "fr" },
          { url: "poster3.jpg", lang: "en" },
        ],
        hdmovielogo: [
          { url: "logo1.jpg", lang: "en" },
          { url: "logo2.jpg", lang: "es" },
        ],
        moviebackground: [
          { url: "bg1.jpg", lang: "en" },
          { url: "bg2.jpg", lang: "fr" },
        ],
      };
      (api.fanart.moviePosters as any).mockResolvedValue({
        data: mockResponse,
      });

      const result = await fanart.movie("123");
      expect(api.fanart.moviePosters).toHaveBeenCalledWith("123");
      expect(result.fanart_posters).toEqual([
        { file_path: "poster1.jpg", source: "fanart" },
        { file_path: "poster3.jpg", source: "fanart" },
      ]);
      expect(result.fanart_logos).toEqual([
        { file_path: "logo1.jpg", source: "fanart" },
      ]);
      expect(result.fanart_backdrops).toEqual([
        { file_path: "bg1.jpg", source: "fanart" },
        { file_path: "bg2.jpg", source: "fanart" },
      ]);
    });

    it("should handle empty response", async () => {
      const mockResponse = {};
      (api.fanart.moviePosters as any).mockResolvedValue({
        data: mockResponse,
      });

      const result = await fanart.movie("123");
      expect(result.fanart_posters).toEqual([]);
      expect(result.fanart_logos).toEqual([]);
      expect(result.fanart_backdrops).toEqual([]);
    });

    it("should handle missing arrays", async () => {
      const mockResponse = {
        movieposter: [],
        hdmovielogo: [],
        moviebackground: [],
      };
      (api.fanart.moviePosters as any).mockResolvedValue({
        data: mockResponse,
      });

      const result = await fanart.movie("123");
      expect(result.fanart_posters).toEqual([]);
      expect(result.fanart_logos).toEqual([]);
      expect(result.fanart_backdrops).toEqual([]);
    });
  });

  describe("show", () => {
    it("should process show posters, logos, and backdrops", async () => {
      const mockResponse = {
        tvposter: [
          { url: "poster1.jpg", lang: "en" },
          { url: "poster2.jpg", lang: "fr" },
        ],
        hdtvlogo: [
          { url: "logo1.jpg", lang: "en" },
          { url: "logo2.jpg", lang: "es" },
        ],
        showbackground: [
          { url: "bg1.jpg", lang: "en" },
          { url: "bg2.jpg", lang: "fr" },
        ],
      };
      (api.fanart.showPosters as any).mockResolvedValue({
        data: mockResponse,
      });

      const result = await fanart.show("456");
      expect(api.fanart.showPosters).toHaveBeenCalledWith("456");
      expect(result.fanart_posters).toEqual([
        { file_path: "poster1.jpg", source: "fanart" },
        { file_path: "poster2.jpg", source: "fanart" },
      ]);
      expect(result.fanart_logos).toEqual([
        { file_path: "logo1.jpg", source: "fanart" },
      ]);
      expect(result.fanart_backdrops).toEqual([
        { file_path: "bg1.jpg", source: "fanart" },
        { file_path: "bg2.jpg", source: "fanart" },
      ]);
    });

    it("should handle empty response", async () => {
      const mockResponse = {};
      (api.fanart.showPosters as any).mockResolvedValue({
        data: mockResponse,
      });

      const result = await fanart.show("456");
      expect(result.fanart_posters).toEqual([]);
      expect(result.fanart_logos).toEqual([]);
      expect(result.fanart_backdrops).toEqual([]);
    });
  });

  describe("season", () => {
    it("should process season posters for specific season", async () => {
      const mockResponse = {
        seasonposter: [
          { url: "s1p1.jpg", season: "1", lang: "en" },
          { url: "s2p1.jpg", season: "2", lang: "en" },
          { url: "s1p2.jpg", season: "1", lang: "fr" },
        ],
      };
      (api.fanart.showPosters as any).mockResolvedValue({
        data: mockResponse,
      });

      const result = await fanart.season("456", 1);
      expect(api.fanart.showPosters).toHaveBeenCalledWith("456");
      expect(result.fanart_posters).toEqual([
        { file_path: "s1p1.jpg", source: "fanart", season: "1" },
        { file_path: "s1p2.jpg", source: "fanart", season: "1" },
      ]);
      expect(result.fanart_backdrops).toEqual([]);
      expect(result.fanart_logos).toEqual([]);
    });

    it("should handle empty seasonposter array", async () => {
      const mockResponse = {
        seasonposter: [],
      };
      (api.fanart.showPosters as any).mockResolvedValue({
        data: mockResponse,
      });

      const result = await fanart.season("456", 1);
      expect(result.fanart_posters).toEqual([]);
    });

    it("should handle missing seasonposter", async () => {
      const mockResponse = {};
      (api.fanart.showPosters as any).mockResolvedValue({
        data: mockResponse,
      });

      const result = await fanart.season("456", 1);
      expect(result.fanart_posters).toEqual([]);
    });
  });
});