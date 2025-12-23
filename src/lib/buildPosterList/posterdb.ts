import { ThePosterDbClient } from "theposterdb-ts";
import type { ThePosterDbPoster, ThePosterDbSearchOptions } from "theposterdb-ts";
import type { FetchedMedia } from "@/lib/types";

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
          previewUrl: poster.optimizedUrl || poster.viewUrl,
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
