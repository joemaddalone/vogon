/**
 * Extract provider IDs from Jellyfin item
 * Jellyfin stores provider IDs in a ProviderIds object
 */
export const extractJellyfinIds = (providerIds?: {
  Tmdb?: string;
  Imdb?: string;
  Tvdb?: string;
}) => {
  if (!providerIds) {
    return {
      tmdbId: undefined,
      imdbId: undefined,
      tvdbId: undefined,
    };
  }

  return {
    tmdbId: providerIds.Tmdb,
    imdbId: providerIds.Imdb,
    tvdbId: providerIds.Tvdb,
  };
};

/**
 * Extract provider IDs from stored JSON string (from database)
 */
export const extractJellyfinIdsFromString = (providerIdsJson?: string | null) => {
  if (!providerIdsJson) {
    return {
      tmdbId: undefined,
      imdbId: undefined,
      tvdbId: undefined,
    };
  }

  try {
    const providerIds = JSON.parse(providerIdsJson);
    return extractJellyfinIds(providerIds);
  } catch {
    return {
      tmdbId: undefined,
      imdbId: undefined,
      tvdbId: undefined,
    };
  }
};

