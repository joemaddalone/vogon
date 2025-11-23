export const dynamic = "force-dynamic";

import { api } from "@/lib/api";
import { Suspense } from "react";
import Home from "./_components/Home";
import { getServerId } from "@/lib/server/getServerId";

export default async function HomePage() {
  const serverId = await getServerId();

  if (!serverId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p>No server configured. Please add a server in the Config page.</p>
      </div>
    );
  }

  const stats = await api.data.plex.stats(serverId);
  const plexConnection = api.plex.test(serverId);

  return (
    <Suspense fallback={<div className="flex items-center justify-center">loading..</div>}>
      <Home stats={stats} plexConnection={plexConnection} />
    </Suspense>
  )
}
