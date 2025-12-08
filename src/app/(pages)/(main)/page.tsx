export const dynamic = "force-dynamic";
import { api } from "@/lib/api";
import Home from "./_components/Home";
import { CommonSuspense } from "@/components/CommonSuspense";
export default async function HomePage() {
  const stats = await api.data.plex.stats();
  const plexConnection = api.mediaserver.test();

  return (
    <CommonSuspense>
      <Home stats={stats} plexConnection={plexConnection} />
    </CommonSuspense>
  )
}
