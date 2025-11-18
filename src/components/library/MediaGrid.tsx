import { motion } from "motion/react";
import { MediaWidget } from "./MediaWidget";
import { MediaGridControl } from "./MediaGridControl";
import { PaginationControls } from "./PaginationControls";
import { Spinner } from "@/components/ui/spinner";
import { useMediaGrid } from "./MediaGridContext";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export const MediaGrid = ({ pending, itemType }: { pending: boolean, itemType: "movie" | "show" }) => {
  const { paginatedMovies, view, totalFilteredCount, items } = useMediaGrid();
  const router = useRouter();

  return (
    <div className="w-full">
      <MediaGridControl />
      <PaginationControls />
      {pending && (
        <div className="flex justify-center items-center h-full min-h-[400px]">
          <Spinner className="size-16 text-gray-500" />
        </div>
      )}

      {!pending && items.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No items in library</p>
          <Button className="mt-4" size="sm" onClick={() => router.push("/import")}>Import Libraries</Button>
        </div>
      )}

      {!pending && items.length > 0 && totalFilteredCount === 0 && (
        <div className="text-center py-12">
          <p className="mx-auto">No items found matching your search</p>
        </div>
      )}

      {!pending && totalFilteredCount > 0 && (
        <>
          <motion.ul className={`film-list ${view}`}>
            {paginatedMovies.map((item) => (
              <motion.li
                key={item.id}
                layout="position"
                transition={{
                  default: { type: "tween", duration: 0.4, bounce: 0.15 },
                }}
              >
                <MediaWidget itemType={itemType} movieData={item} mode={view} />
              </motion.li>
            ))}
          </motion.ul>

          <PaginationControls />
        </>
      )}
    </div>
  );
};

