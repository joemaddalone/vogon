import { MediaGridProvider } from "./MediaGridContext";
import { MediaGrid } from "./MediaGrid";
import { PlexMovie, Selectable, PlexShow } from "@/lib/types";

export const Library = ({
  items,
  pending,
  type,
}: {
  items: Selectable<PlexMovie>[] | Selectable<PlexShow>[];
  pending: boolean;
  type: "movie" | "show";
}) => {
  return (
    <MediaGridProvider initialItems={items}>
      <MediaGrid pending={pending} itemType={type} />
    </MediaGridProvider>
  );
};
