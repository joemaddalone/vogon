export const extractKnownIds = (guid: Record<string, string>[]) => {
  const ids = guid.map((guid: Record<string, string>): string => guid.id);
  const tmdbId = ids.find((str: string) => str.startsWith("tmdb")) || "";
  const imdbId = ids.find((str: string) => str.startsWith("imdb")) || "";
  const tvdbId = ids.find((str: string) => str.startsWith("tvdb")) || "";
  return {
    tmdb: tmdbId?.split("://")[1],
    imdb: imdbId?.split("://")[1],
    tvdb: tvdbId?.split("://")[1],
  };
};