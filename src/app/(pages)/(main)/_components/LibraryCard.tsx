import Link from "next/link";
import { useTranslations } from "next-intl";

export const LibraryCard = ({
  count,
  type,
  icon,
}: {
  count: number;
  type: "movie" | "show";
  icon: React.ReactNode;
}) => {
  const t = useTranslations();
  return (
    <Link href={`/${type}`} className="block group">
      <div className="library-card">
        <div className="highlight" />
        <div className="relative">
          {icon}
          <h2 className="capitalize">
            {type === "movie"
              ? t("common.movie", { count })
              : t("common.show", { count })}
          </h2>
          <div className="library-count">
            <span>{count}</span>
            <span className="library-count-label">
              {type === "movie"
                ? t("common.movie", { count })
                : t("common.show", { count })}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};
