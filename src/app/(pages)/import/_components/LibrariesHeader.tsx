import { motion } from "motion/react";
import { useTranslations } from "next-intl";

export const LibrariesHeader = () => {
  const t = useTranslations();

  return (
    <motion.div
      className="mb-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1>
        {t("import.selectLibrary")}
      </h1>
      <p>
        {t("import.selectLibraryDescription")}
      </p>
    </motion.div>
  );
};
