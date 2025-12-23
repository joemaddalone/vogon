import { describe, it, expect, vi, beforeEach } from "vitest";
import { buildPosters } from "./index";
import { getClients } from "@/lib/client/getClients";
import { api } from "@/lib/api";
import { determineTmdbId } from "./determineTmdbId";
import { fetchTmdbDetails } from "./fetchTmdbDetails";
import * as fanart from "./fanart";
import * as tmdb from "./tmdb";
import * as posterdb from "./posterdb";

vi.mock("@/lib/client/getClients");
vi.mock("@/lib/api");
vi.mock("./determineTmdbId");
vi.mock("./fetchTmdbDetails");
vi.mock("./fanart");
vi.mock("./tmdb");
vi.mock("./posterdb");

describe("buildPosters", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should build posters for a movie successfully", async () => {
    const mockConfig = {
      fanartApiKey: "key",
      thePosterDbEmail: "email",
      thePosterDbPassword: "pass",
      thePosterDb: {} as any,
    };
    (getClients as any).mockResolvedValue(mockConfig);

    const mockMedia = {
      title: "Test Movie",
      year: 2023,
      providerIds: { tmdb: "123" },
    };
    (api.mediaserver.movieDetail as any).mockResolvedValue({
      data: mockMedia,
    });

    (determineTmdbId as any).mockResolvedValue("123");
    (fetchTmdbDetails as any).mockResolvedValue({ id: 123, images: { posters: [], backdrops: [] } });

    (fanart.movie as any).mockResolvedValue({
      fanart_posters: [{ file_path: "fposter.jpg", source: "fanart" }],
      fanart_backdrops: [{ file_path: "fbackdrop.jpg", source: "fanart" }],
      fanart_logos: [{ file_path: "flogo.jpg", source: "fanart" }],
    });

    (tmdb.images as any).mockResolvedValue({
      tmdb_posters: [{ file_path: "tposter.jpg", source: "tmdb" }],
      tmdb_backdrops: [{ file_path: "tbackdrop.jpg", source: "tmdb" }],
    });

    (posterdb.images as any).mockResolvedValue({
      theposterdb_posters: [{ file_path: "pposter.jpg", source: "theposterdb" }],
    });

    const result = await buildPosters("123", "movie");

    expect(result.error).toBeUndefined();
    expect(result.posters).toEqual([
      { file_path: "fposter.jpg", source: "fanart" },
      { file_path: "tposter.jpg", source: "tmdb" },
      { file_path: "pposter.jpg", source: "theposterdb" },
    ]);
    expect(result.backdrops).toEqual([
      { file_path: "fbackdrop.jpg", source: "fanart" },
      { file_path: "tbackdrop.jpg", source: "tmdb" },
    ]);
    expect(result.logos).toEqual([
      { file_path: "flogo.jpg", source: "fanart" },
    ]);
    expect(result.media).toEqual(mockMedia);
    expect(result.tmdbId).toBe("123");
  });

  it("should return error if no config", async () => {
    (getClients as any).mockResolvedValue(null);

    const result = await buildPosters("123", "movie");
    expect(result.error).toBe("No config found");
  });

  it("should return error if media not found", async () => {
    const mockConfig = {};
    (getClients as any).mockResolvedValue(mockConfig);
    (api.mediaserver.movieDetail as any).mockResolvedValue({ data: null });

    const result = await buildPosters("123", "movie");
    expect(result.error).toBe("Plex movie not found");
  });

  it("should return error if tmdbMedia not found", async () => {
    const mockConfig = {};
    (getClients as any).mockResolvedValue(mockConfig);
    const mockMedia = { title: "Test", providerIds: {} };
    (api.mediaserver.movieDetail as any).mockResolvedValue({ data: mockMedia });
    (determineTmdbId as any).mockResolvedValue("123");
    (fetchTmdbDetails as any).mockResolvedValue(null);

    const result = await buildPosters("123", "movie");
    expect(result.error).toBe("TMDB media not found");
  });

  it("should skip fanart if no api key", async () => {
    const mockConfig = {}; // no fanartApiKey
    (getClients as any).mockResolvedValue(mockConfig);
    const mockMedia = { title: "Test", providerIds: { tmdb: "123" } };
    (api.mediaserver.movieDetail as any).mockResolvedValue({ data: mockMedia });
    (determineTmdbId as any).mockResolvedValue("123");
    (fetchTmdbDetails as any).mockResolvedValue({ images: { posters: [], backdrops: [] } });
    (tmdb.images as any).mockResolvedValue({ tmdb_posters: [], tmdb_backdrops: [] });

    const result = await buildPosters("123", "movie");
    expect(fanart.movie).not.toHaveBeenCalled();
    expect(result.posters).toEqual([]);
    expect(result.backdrops).toEqual([]);
    expect(result.logos).toEqual([]);
  });

  it("should skip posterdb if not configured", async () => {
    const mockConfig = {}; // no posterdb
    (getClients as any).mockResolvedValue(mockConfig);
    const mockMedia = { title: "Test", providerIds: { tmdb: "123" } };
    (api.mediaserver.movieDetail as any).mockResolvedValue({ data: mockMedia });
    (determineTmdbId as any).mockResolvedValue("123");
    (fetchTmdbDetails as any).mockResolvedValue({ images: { posters: [], backdrops: [] } });
    (tmdb.images as any).mockResolvedValue({ tmdb_posters: [], tmdb_backdrops: [] });

    const result = await buildPosters("123", "movie");
    expect(posterdb.images).not.toHaveBeenCalled();
  });

  it("should handle show type", async () => {
    const mockConfig = { fanartApiKey: "key" };
    (getClients as any).mockResolvedValue(mockConfig);
    const mockMedia = { title: "Test Show", providerIds: { tvdb: "456" } };
    (api.mediaserver.showDetail as any).mockResolvedValue({ data: mockMedia });
    (determineTmdbId as any).mockResolvedValue("456");
    (fetchTmdbDetails as any).mockResolvedValue({ images: { posters: [], backdrops: [] } });
    (fanart.show as any).mockResolvedValue({ fanart_posters: [], fanart_backdrops: [], fanart_logos: [] });
    (tmdb.images as any).mockResolvedValue({ tmdb_posters: [], tmdb_backdrops: [] });

    await buildPosters("456", "show");
    expect(api.mediaserver.showDetail).toHaveBeenCalledWith("456");
    expect(fanart.show).toHaveBeenCalledWith("456");
  });

  it("should handle season type", async () => {
    const mockConfig = { fanartApiKey: "key" };
    (getClients as any).mockResolvedValue(mockConfig);
    const mockMedia = { title: "Test Show", providerIds: { tvdb: "456" } };
    const mockSeasonMedia = { title: "Season 1" };
    (api.mediaserver.seasonDetail as any).mockResolvedValueOnce({ data: mockMedia }).mockResolvedValueOnce({ data: mockSeasonMedia });
    (determineTmdbId as any).mockResolvedValue("456");
    (fetchTmdbDetails as any).mockResolvedValue({ images: { posters: [], backdrops: [] } });
    (fanart.season as any).mockResolvedValue({ fanart_posters: [], fanart_backdrops: [], fanart_logos: [] });
    (tmdb.images as any).mockResolvedValue({ tmdb_posters: [], tmdb_backdrops: [] });

    const result = await buildPosters("456", "season", 1, "789");
    expect(api.mediaserver.seasonDetail).toHaveBeenCalledWith("456");
    expect(api.mediaserver.seasonDetail).toHaveBeenCalledWith("789");
    expect(fanart.season).toHaveBeenCalledWith("456", 1);
    expect(result.media).toEqual(mockSeasonMedia);
    expect(result.mediaType).toBe("season");
  });
});