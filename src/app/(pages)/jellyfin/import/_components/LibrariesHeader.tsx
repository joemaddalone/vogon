import { motion } from "motion/react";
export const LibrariesHeader = () => {
  return (
    <motion.div
      className="mb-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1>
        Select Jellyfin Library
      </h1>
      <p>
        Choose a library to import and manage poster artwork. Be sure the
        library actually contains movies or TV shows. If the library contains
        other types of media you won&apos;t have much luck finding posters for
        it.
      </p>
    </motion.div>
  );
};
