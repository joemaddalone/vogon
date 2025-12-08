import { FadeIn } from "@/components/FadeIn";

import { useTranslations } from "next-intl";

export const LibrariesHeader = () => {
  const t = useTranslations();

  return (
    <FadeIn className="mb-12">
      <h1>
        {t("import.selectLibrary")}
      </h1>
      <p>
        {t("import.selectLibraryDescription")}
      </p>
    </FadeIn>
  );
};
