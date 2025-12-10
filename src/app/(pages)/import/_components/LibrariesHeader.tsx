import { FadeIn } from "@/components/FadeIn";

import { useTranslations } from "next-intl";

export const LibrariesHeader = () => {
  const t = useTranslations();

  return (
    <FadeIn className="mb-12">
      <h1>
        {t("common.import")}
      </h1>
    </FadeIn>
  );
};
