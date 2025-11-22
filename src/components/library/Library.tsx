import { MediaGridProvider } from "./MediaGridContext";
import { MediaGrid } from "./MediaGrid";
import { Media, Selectable } from "@/lib/types";

export const Library = ({
  items,
  pending,
  type,
}: {
  items: Selectable<Media>[] ;
  pending: boolean;
  type: "movie" | "show";
}) => {
  return (
    <MediaGridProvider initialItems={items}>
      <MediaGrid pending={pending} itemType={type} />
    </MediaGridProvider>
  );
};
