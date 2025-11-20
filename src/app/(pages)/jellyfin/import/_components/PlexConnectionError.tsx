"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { AlertCircle, RefreshCw } from "lucide-react";

export const PlexConnectionError = ({ error }: { error: string }) => {
  const router = useRouter();

  const handleRetry = () => {
    router.refresh();
  };

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
              Connection Error
            </h2>
            <p className="text-lg text-red-700 dark:text-red-300 font-medium leading-relaxed">{error}</p>
          </div>
        </div>

        <div className="text-base text-red-600 dark:text-red-400 bg-red-100/50 dark:bg-red-950/30 rounded-xl p-6">
          <p className="font-semibold mb-3">Make sure you have set:</p>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li className="font-medium">PLEX_SERVER_URL in your environment variables</li>
            <li className="font-medium">PLEX_TOKEN in your environment variables</li>
          </ul>
        </div>

        <Button
          onClick={handleRetry}
          className="mt-6 rounded-xl font-medium transition-all duration-300 hover:scale-105"
          size="lg"
        >
          <RefreshCw className="w-4 h-4" />
          Retry Connection
        </Button>
      </motion.div>
    </div>
  );
};
