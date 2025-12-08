import { FadeIn } from "@/components/FadeIn";
import { useTranslations } from "next-intl";

export const Empty = () => {
  const t = useTranslations();

  return (
    <FadeIn className="text-center py-20">
      <p className="text-xl text-muted-foreground font-light">
        {t("import.noLibrariesFound")}
      </p>
    </FadeIn>
  );
};
