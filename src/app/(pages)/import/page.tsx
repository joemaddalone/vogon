export const dynamic = "force-dynamic";
import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import { PlexConnectionError } from "./_components/PlexConnectionError";
import { Libraries } from "./_components/Libraries";
import { api } from "@/lib/api";

export default async function ImportLibraryPage() {
  const { data, error } = await api.plex.libraries();

  if (error) {
    return <PlexConnectionError error={error.message} />;
  }

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <Spinner className="size-16 text-gray-500" />
        </div>
      }
    >
      <Libraries libraries={data} />
    </Suspense>
  );
}
