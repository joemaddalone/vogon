"use client";
import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { api } from "@/lib/api";
import { Selectable, Server } from "@/lib/types";

const STORAGE_KEY = "vogon-selected-server-id";

interface ServerContextValue {
  selectedServerId: number | null;
  setSelectedServerId: (id: number | null) => void;
  servers: Selectable<Server>[];
  selectedServer: Selectable<Server> | null;
  isLoading: boolean;
  refreshServers: () => Promise<void>;
}

const ServerContext = createContext<ServerContextValue>({
  selectedServerId: null,
  setSelectedServerId: () => {},
  servers: [],
  selectedServer: null,
  isLoading: true,
  refreshServers: async () => {},
});

export const ServerProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selectedServerId, setSelectedServerIdState] = useState<number | null>(
    null
  );
  const [servers, setServers] = useState<Selectable<Server>[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load servers list
  const loadServers = async () => {
    try {
      const response = await api.server.get();
      if (response.data) {
        setServers(response.data);
        return response.data;
      }
    } catch (error) {
      console.error("Failed to load servers:", error);
    }
    return [];
  };

  // Load selected server ID from localStorage on mount
  useEffect(() => {
    const loadInitialState = async () => {
      setIsLoading(true);

      // Load servers first
      const loadedServers = await loadServers();

      // Try to load from localStorage
      if (typeof window !== "undefined") {
        const storedId = localStorage.getItem(STORAGE_KEY);
        if (storedId) {
          const id = parseInt(storedId, 10);
          // Verify server still exists
          if (loadedServers.some((s) => s.id === id)) {
            setSelectedServerIdState(id);
            // Sync cookie for server components
            document.cookie = `vogon-selected-server-id=${id.toString()}; path=/; max-age=31536000`;
            setIsLoading(false);
            return;
          } else {
            // Stored server no longer exists, clear it
            localStorage.removeItem(STORAGE_KEY);
            document.cookie = `vogon-selected-server-id=; path=/; max-age=0`;
          }
        }
      }

      // Auto-select first server if none selected
      // Check localStorage first to see if we have a stored value
      let shouldAutoSelect = true;
      if (typeof window !== "undefined") {
        const storedId = localStorage.getItem(STORAGE_KEY);
        if (storedId) {
          const id = parseInt(storedId, 10);
          if (loadedServers.some((s) => s.id === id)) {
            shouldAutoSelect = false;
          }
        }
      }

      if (loadedServers.length > 0 && shouldAutoSelect) {
        const firstServerId = loadedServers[0].id;
        setSelectedServerIdState(firstServerId);
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY, firstServerId.toString());
          document.cookie = `vogon-selected-server-id=${firstServerId.toString()}; path=/; max-age=31536000`;
        }
      }

      setIsLoading(false);
    };

    loadInitialState();
  }, []);

  // Persist selected server ID to localStorage and cookie when it changes
  useEffect(() => {
    if (selectedServerId !== null && typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, selectedServerId.toString());
      // Set cookie for server components
      document.cookie = `vogon-selected-server-id=${selectedServerId.toString()}; path=/; max-age=31536000`; // 1 year
    } else if (selectedServerId === null && typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
      // Clear cookie
      document.cookie = `vogon-selected-server-id=; path=/; max-age=0`;
    }
  }, [selectedServerId]);

  // Auto-select first server if current selection is deleted
  useEffect(() => {
    if (
      selectedServerId !== null &&
      !servers.some((s) => s.id === selectedServerId) &&
      servers.length > 0
    ) {
      const firstServerId = servers[0].id;
      setTimeout(() => {
        setSelectedServerIdState(firstServerId);
      }, 0);
    } else if (
      selectedServerId !== null &&
      !servers.some((s) => s.id === selectedServerId) &&
      servers.length === 0
    ) {
      // No servers available, clear selection
      setTimeout(() => {
        setSelectedServerIdState(null);
      }, 0);
    }
  }, [servers, selectedServerId]);

  const setSelectedServerId = (id: number | null) => {
    setSelectedServerIdState(id);
  };

  const refreshServers = async () => {
    await loadServers();
  };

  // Compute selected server object
  const selectedServer = useMemo(() => {
    if (selectedServerId === null) return null;
    return servers.find((s) => s.id === selectedServerId) || null;
  }, [servers, selectedServerId]);

  return (
    <ServerContext.Provider
      value={{
        selectedServerId,
        setSelectedServerId,
        servers,
        selectedServer,
        isLoading,
        refreshServers,
      }}
    >
      {children}
    </ServerContext.Provider>
  );
};

export const useServer = () => useContext(ServerContext);

