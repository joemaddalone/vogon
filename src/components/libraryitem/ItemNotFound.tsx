import { useTranslations } from "next-intl";
export const ItemNotFound = () => {
  const t = useTranslations();
  return (
    <div className="flex flex-col items-center justify-center min-h-[30vh]">
      {t("library.notFoundErrorMessage")}
    </div>
  );
};