"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/FadeIn";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";

export const PlexConnectionError = ({ error }: { error: string }) => {
  const router = useRouter();
  const t = useTranslations();

  const handleRetry = () => {
    router.refresh();
  };

  return (
    <div className="max-w-3xl mx-auto mt-12 p-8">
      <FadeIn className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8">
        <div className="flex items-start gap-4 mb-6">
          <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400 shrink-0 mt-1" />
          <div>
            <h2 className="text-2xl font-bold text-red-900 dark:text-red-100 mb-3">
              {t("import.connectionError")}
            </h2>
            <p className="text-lg text-red-700 dark:text-red-300 font-medium leading-relaxed">{error}</p>
          </div>
        </div>

        <div className="text-base text-red-600 dark:text-red-400 bg-red-100/50 dark:bg-red-950/30 rounded-xl p-6">
          <p className="font-semibold mb-3">{t("import.connectionErrorInstructions")}</p>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li className="font-medium">{t("import.serverUrlRequired")}</li>
            <li className="font-medium">{t("import.serverTokenRequired")}</li>
          </ul>
        </div>

        <Button
          onClick={handleRetry}
          className="mt-6 rounded-xl font-medium transition-all duration-300 hover:scale-105"
          size="lg"
        >
          <RefreshCw className="w-4 h-4" />
          {t("import.retryConnection")}
        </Button>
      </FadeIn>
    </div>
  );
};
