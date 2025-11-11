export const dynamic = "force-dynamic";
import { PlexShow } from "@/lib/types";
import { LibraryError } from "@/components/library/LibraryError";
import { MediaLibrarySection } from "@/components/library/MediaLibrarySection";
import { api } from "@/lib/api";

export default async function ShowsPage() {
  let loading = true
  const { data, error } = await api.data.shows();
  loading = false;

  if (error) {
    return <LibraryError error={error.message} />;
  }

  return (
    // <MovieLibrary movies={data as unknown as PlexMovie[]} loading={loading} />
    <MediaLibrarySection
      items={data as unknown as PlexShow[]}
      loading={loading}
      totalLabel="shows"
      type="show"
    />
  );
}
