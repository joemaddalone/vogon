"use client";
import { ThemeProvider } from "@/components/ThemeProvider";
import { HistoryProvider } from "@/app/contexts/HistoryContext";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <HistoryProvider>{children}</HistoryProvider>
    </ThemeProvider>
  );
};