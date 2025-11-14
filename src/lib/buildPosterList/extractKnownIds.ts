export const extractKnownIds = (guid: Record<string, string>[]) => {
  const ids = guid.map((guid: Record<string, string>): string => guid.id);
  const tmdbId = ids.find((str: string) => str.startsWith("tmdb")) || "";
  const imdbId = ids.find((str: string) => str.startsWith("imdb")) || "";
  const tvdbId = ids.find((str: string) => str.startsWith("tvdb")) || "";
  return {
    tmdbId: tmdbId?.split("://")[1],
    imdbId: imdbId?.split("://")[1],
    tvdbId: tvdbId?.split("://")[1],
  };
};