import { describe, it, expect, vi, beforeEach } from "vitest";
import { determineTmdbId } from "./determineTmdbId";
import { api } from "@/lib/api";

vi.mock("@/lib/api", () => ({
	api: {
		tmdb: {
			find: vi.fn(),
		},
	},
}));

describe("determineTmdbId", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should return null if knownIds is undefined", async () => {
		const result = await determineTmdbId(undefined);
		expect(result).toBeNull();
	});

	it("should return tmdb id if it exists in knownIds", async () => {
		const knownIds = { tmdb: "123" };
		const result = await determineTmdbId(knownIds);
		expect(result).toBe("123");
		expect(api.tmdb.find).not.toHaveBeenCalled();
	});

	it("should resolve tmdb id from tvdb id if tmdb id is missing", async () => {
		const knownIds = { tvdb: "456" };
		(api.tmdb.find as any).mockResolvedValue({
			data: [{ id: "789" }],
			error: undefined,
		});

		const result = await determineTmdbId(knownIds);
		expect(api.tmdb.find).toHaveBeenCalledWith("456", "tvdb_id");
		expect(result).toBe("789");
	});

	it("should resolve tmdb id from imdb id if tmdb and tvdb ids are missing", async () => {
		const knownIds = { imdb: "tt1234567" };
		(api.tmdb.find as any).mockResolvedValue({
			data: [{ id: "999" }],
			error: undefined,
		});

		const result = await determineTmdbId(knownIds);
		expect(api.tmdb.find).toHaveBeenCalledWith("tt1234567", "imdb_id");
		expect(result).toBe("999");
	});

	it("should return null if tvdb lookup fails or returns no data", async () => {
		(api.tmdb.find as any).mockResolvedValue({
			data: [],
			error: undefined,
		});

		const result = await determineTmdbId({ tvdb: "456" });
		expect(result).toBeNull();
	});

	it("should return null if imdb lookup fails or returns no data", async () => {
		(api.tmdb.find as any).mockResolvedValue({
			data: [],
			error: undefined,
		});

		const result = await determineTmdbId({ imdb: "tt123" });
		expect(result).toBeNull();
	});

	it("should return null if api.tmdb.find returns an error", async () => {
		(api.tmdb.find as any).mockResolvedValue({
			data: undefined,
			error: new Error("API error"),
		});

		const result = await determineTmdbId({ tvdb: "456" });
		expect(result).toBeNull();
	});

	it("should prioritize tmdb over tvdb", async () => {
		const knownIds = { tmdb: "123", tvdb: "456" };
		const result = await determineTmdbId(knownIds);
		expect(result).toBe("123");
		expect(api.tmdb.find).not.toHaveBeenCalled();
	});

	it("should prioritize tvdb over imdb", async () => {
		const knownIds = { tvdb: "456", imdb: "tt123" };
		(api.tmdb.find as any).mockResolvedValue({
			data: [{ id: "789" }],
			error: undefined,
		});

		const result = await determineTmdbId(knownIds);
		expect(api.tmdb.find).toHaveBeenCalledWith("456", "tvdb_id");
		expect(api.tmdb.find).not.toHaveBeenCalledWith("tt123", "imdb_id");
		expect(result).toBe("789");
	});
});
