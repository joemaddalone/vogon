import { motion } from "motion/react";

export const LibrariesError = ({ error }: { error: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6"
    >
      <p className="text-red-700 dark:text-red-300 font-medium">{error}</p>
    </motion.div>
  );
};
