export const dynamic = "force-dynamic";
import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Libraries } from "./_components/Libraries";
import { api } from "@/lib/api";
import { getServerId } from "@/lib/server/getServerId";

export default async function ImportLibraryPage() {
  const serverId = await getServerId();

  if (!serverId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p>No server configured. Please add a server in the Config page.</p>
      </div>
    );
  }

  const libs = api.plex.libraries(serverId);

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <Spinner className="size-16 text-gray-500" />
        </div>
      }
    >
       <Libraries libs={libs}  />
    </Suspense>
  );
}
