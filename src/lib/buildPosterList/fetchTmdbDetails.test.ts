import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchTmdbDetails } from "./fetchTmdbDetails";
import { api } from "@/lib/api";

vi.mock("@/lib/api", () => ({
  api: {
    tmdb: {
      detail: vi.fn(),
      showDetail: vi.fn(),
      seasonDetail: vi.fn(),
    },
  },
}));

describe("fetchTmdbDetails", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch movie details successfully", async () => {
    const mockData = { id: 123, title: "Test Movie" };
    (api.tmdb.detail as any).mockResolvedValue({
      data: mockData,
      error: undefined,
    });

    const result = await fetchTmdbDetails("123", "movie");
    expect(api.tmdb.detail).toHaveBeenCalledWith("123", undefined);
    expect(result).toEqual(mockData);
  });

  it("should fetch show details successfully", async () => {
    const mockData = { id: 456, name: "Test Show" };
    (api.tmdb.showDetail as any).mockResolvedValue({
      data: mockData,
      error: undefined,
    });

    const result = await fetchTmdbDetails("456", "show");
    expect(api.tmdb.showDetail).toHaveBeenCalledWith("456", undefined);
    expect(result).toEqual(mockData);
  });

  it("should fetch season details successfully", async () => {
    const mockData = { id: 789, season_number: 1 };
    (api.tmdb.seasonDetail as any).mockResolvedValue({
      data: mockData,
      error: undefined,
    });

    const result = await fetchTmdbDetails("789", "season", 1);
    expect(api.tmdb.seasonDetail).toHaveBeenCalledWith("789", 1);
    expect(result).toEqual(mockData);
  });

  it("should return null if API returns an error for movie", async () => {
    (api.tmdb.detail as any).mockResolvedValue({
      data: undefined,
      error: new Error("API error"),
    });

    const result = await fetchTmdbDetails("123", "movie");
    expect(result).toBeNull();
  });

  it("should return null if API returns an error for show", async () => {
    (api.tmdb.showDetail as any).mockResolvedValue({
      data: undefined,
      error: new Error("API error"),
    });

    const result = await fetchTmdbDetails("456", "show");
    expect(result).toBeNull();
  });

  it("should return null if API returns an error for season", async () => {
    (api.tmdb.seasonDetail as any).mockResolvedValue({
      data: undefined,
      error: new Error("API error"),
    });

    const result = await fetchTmdbDetails("789", "season", 1);
    expect(result).toBeNull();
  });
});