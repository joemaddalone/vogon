export const dynamic = "force-dynamic";

import { api } from "@/lib/api";
import { Suspense } from "react";
import Home from "./_components/Home";

export default async function HomePage() {
  const stats = await api.data.plex.stats();
  const plexConnection = api.plex.test();

  return (
    <Suspense fallback={<div className="flex items-center justify-center">loading..</div>}>
      <Home stats={stats} plexConnection={plexConnection} />
    </Suspense>
  )
}
