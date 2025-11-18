"use client";
import { ThemeProvider } from "@/components/context/ThemeProvider";
import { HistoryProvider } from "@/components/context/HistoryContext";
import { useEffect } from "react";
export const Providers = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <HistoryProvider>{children}</HistoryProvider>
    </ThemeProvider>
  );
};