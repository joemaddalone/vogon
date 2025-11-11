import Link from "next/link";

export const LibraryCard = ({ count, type, icon }: { count: number, type: "movie" | "show", icon: React.ReactNode }) => {
  return (
    <Link href={`/${type}`} className="block group">
      <div className="library-card">
        <div className="highlight" />
        <div className="relative">
          {icon}
          <h2>{type === "movie" ? "Movies" : "Shows"}</h2>
          <div className="library-count">
            <span>{count}</span>
            <span className="library-count-label">{type === "movie" ? "movies" : "shows"}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
