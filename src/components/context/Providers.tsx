"use client";
import { ThemeProvider } from "@/components/context/ThemeProvider";
import { HistoryProvider } from "@/components/context/HistoryContext";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <HistoryProvider>{children}</HistoryProvider>
    </ThemeProvider>
  );
};