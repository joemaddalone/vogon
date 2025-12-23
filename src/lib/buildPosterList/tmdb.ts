import { TMDBDetail, FetchedMedia } from "@/lib/types";

export const images = async (tmdbMedia: TMDBDetail) => {
	const p: FetchedMedia[] = [];
	const b: FetchedMedia[] = [];
	if (tmdbMedia.images.posters && tmdbMedia.images.posters.length > 0) {
    tmdbMedia.images.posters.forEach((poster: { file_path: string }) => {
      p.push({
        file_path: `https://image.tmdb.org/t/p/w500/${poster.file_path}`,
        source: "tmdb",
      });
    });
  }
  if (tmdbMedia.images.backdrops && tmdbMedia.images.backdrops.length > 0) {
    tmdbMedia.images.backdrops.forEach((backdrop: { file_path: string }) => {
      b.push({
        file_path: `https://image.tmdb.org/t/p/w500/${backdrop.file_path}`,
        source: "tmdb",
      });
    });
  }
	return { tmdb_posters: p, tmdb_backdrops: b };
}