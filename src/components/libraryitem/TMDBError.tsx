import { useTranslations } from "next-intl";
export const TMDBError = ({ knownIds }: { knownIds: Record<string, string | null> }) => {
  const t = useTranslations();
  return (
    <div className="flex flex-col items-center justify-center mw-[600px] mx-auto">
      <h2>
        {t("library.tmdbError")}
      </h2>
      <div className="mt-4 text-sm">
        <p>TMDB ID: {knownIds.tmdbId || "N/A"}</p>
        <p>IMDB ID: {knownIds.imdbId || "N/A"}</p>
        <p>TVDB ID: {knownIds.tvdbId || "N/A"}</p>
        <p className="mt-4 border-t border-gray-200 pt-4 text-sm font-bold">
          {t("library.tmdbErrorMessage")}
          <br />
          {t("library.tmdbErrorMessage2")}
        </p>
      </div>
    </div>
  );
};
