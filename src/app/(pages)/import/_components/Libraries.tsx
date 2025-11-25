"use client";
import { NormalizedLibrary, ApiResponse } from "@/lib/types";
import { LibrariesHeader } from "./LibrariesHeader";
import { LibraryImport } from "./LibraryImport";
import { PlexConnectionError } from "./PlexConnectionError";
import { Empty } from "./Empty";
import { use } from 'react';

export const Libraries = ({libs}: { libs: Promise<ApiResponse<NormalizedLibrary[]>>}) => {

  const { data, error } = use(libs)

  if (error) {
    return <PlexConnectionError error={error.toString()} />;
  }

  return (
    <div className="max-w-4xl mx-auto mt-12">
      <LibrariesHeader />
      {data?.length === 0 ? (
        <Empty />
      ) : (
        <div className="grid gap-6">
          {data?.map((library, index) => (
            <LibraryImport key={library.id} library={library} index={index} />
          ))}
        </div>
      )}
    </div>
  );
};
