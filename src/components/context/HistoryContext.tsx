"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

const HistoryContext = createContext<{ history: string[]; back: () => void }>({
  history: [],
  back: () => {},
});

export const HistoryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    // Add current pathname to history
    const doThing = () => {
      setHistory((prevHistory) => {
        // Avoid adding duplicate consecutive paths
        if (prevHistory[prevHistory.length - 1] !== pathname) {
          return [...prevHistory, pathname];
        }
        return prevHistory;
      });
    }
    doThing();
  }, [pathname]);

  const back = () => {
    router.back();
  };

  return (
    <HistoryContext.Provider value={{ history, back }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => useContext(HistoryContext);
