"use client";
import { PlexLibrary } from "@/lib/types/plex";
import { motion } from "motion/react";
import { LibrariesHeader } from "./LibrariesHeader";
import { LibrariesError } from "./LibrariesError";
import { LibraryImport } from "./LibraryImport";

export const Libraries = ({ libraries, error }: { libraries: PlexLibrary[], error?: string }) => {
  return (
    <div className="max-w-4xl mx-auto mt-12">
      <LibrariesHeader />

      {error && (
        <LibrariesError error={error} />
      )}

      {libraries.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-20"
        >
          <p className="text-xl text-muted-foreground font-light">
            No libraries found in your Plex server.
          </p>
        </motion.div>
      ) : (
        <div className="grid gap-6">
          {libraries.map((library, index) => (
            <LibraryImport key={library.key} library={library} index={index} />
          ))}
        </div>
      )}
    </div>
  );
};
