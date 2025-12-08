"use client";

import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

type LibraryErrorProps = {
  error: string;
};

export const LibraryError = ({ error }: LibraryErrorProps) => {
  const router = useRouter();
  const t = useTranslations();
  return (
    <div className="max-w-3xl mx-auto mt-12 p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8"
      >
        <div className="flex items-start gap-4 mb-6">
          <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400 shrink-0 mt-1" />
          <div>
            <h2 className="text-2xl font-bold text-red-900 dark:text-red-100 mb-3">
              {t("library.errorLoadingLibrary")}
            </h2>
            <p className="text-lg text-red-700 dark:text-red-300 font-medium leading-relaxed">
              {error}
            </p>
          </div>
        </div>

        <Button
          onClick={() => router.push("/")}
          variant="outline"
          className="mt-6 rounded-xl font-medium transition-all duration-300 hover:scale-105"
          size="lg"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("library.backToHome")}
        </Button>
      </motion.div>
    </div>
  );
};

