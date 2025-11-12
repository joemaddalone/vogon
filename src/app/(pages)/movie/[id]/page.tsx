export const dynamic = "force-dynamic";
import { Suspense } from "react";
import { buildPosters } from "@/lib/buildPosterList";
import { MovieDetails } from "./_components/MovieDetails";
import { Spinner } from "@/components/ui/spinner";

export default async function PlexShowPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const posterBuilder = buildPosters(id, "movie");

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <Spinner className="size-16 text-gray-500" />
        </div>
      }
    >
      {/* @ts-expect-error Server Component */}
      <MovieDetails posterBuilder={posterBuilder} id={id} />
    </Suspense>
  );
}
