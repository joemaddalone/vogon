export const TMDBError = ({ knownIds }: { knownIds: Record<string, string> }) => {
  return (
    <div className="flex flex-col items-center justify-center mw-[600px] mx-auto">
      <div className="text-2xl font-bold">
        Damn, we could not find this one..
      </div>
      <div className="mt-4 text-sm">
        <p>TMDB ID: {knownIds.tmdbId || "N/A"}</p>
        <p>IMDB ID: {knownIds.imdbId || "N/A"}</p>
        <p>TVDB ID: {knownIds.tvdbId || "N/A"}</p>
        <p className="mt-4 border-t border-gray-200 pt-4 text-sm font-bold">
          This just means we can&apos;t connect the data listed above to TMDB.
          <br />
          You should probably have Plex &quot;Match&quot; this show again.
        </p>
      </div>
    </div>
  );
};
