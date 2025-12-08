import { FadeIn } from "@/components/FadeIn";

export const LibrariesError = ({ error }: { error: string }) => {
  return (
    <FadeIn className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6">
      <p className="text-red-700 dark:text-red-300 font-medium">{error}</p>
    </FadeIn>
  );
};
