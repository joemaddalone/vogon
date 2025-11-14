import { ThePosterDbClient } from "@/lib/client/theposterdb";
import { ThePosterDbPoster, ThePosterDbSearchOptions, FetchedMedia } from "@/lib/types";

export const images = async (
  theposterdb: ThePosterDbClient,
  options: ThePosterDbSearchOptions
) => {
  const p: FetchedMedia[] = [];
  try {
    const theposterdbPosters = await theposterdb.search(options);
    if (theposterdbPosters.length > 0) {
      theposterdbPosters.forEach((poster: ThePosterDbPoster) => {
        p.push({
          file_path: poster.url,
          previewUrl: poster.url.replace("/download", "/view"),
          source: "theposterdb",
        });
      });
    }
    return { theposterdb_posters: p };
  } catch (error) {
    console.error("Error searching ThePosterDB:", error);
    return { theposterdb_posters: [] };
  }
};
