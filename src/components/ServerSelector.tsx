"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useServer } from "@/components/context/ServerContext";
import { Server } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function ServerSelector() {
  const {
    selectedServerId,
    setSelectedServerId,
    servers,
    selectedServer,
    isLoading,
    refreshServers,
  } = useServer();
  const router = useRouter();

  // Refresh servers when component mounts (in case servers were added/removed)
  useEffect(() => {
    refreshServers();
  }, []);

  const handleValueChange = (value: string) => {
    const serverId = parseInt(value, 10);
    if (!isNaN(serverId)) {
      setSelectedServerId(serverId);
      // Cookie is set automatically by ServerContext useEffect
      // Refresh the page to update all server-dependent data
      router.refresh();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl text-sm sm:text-base">
        <Spinner className="h-4 w-4" />
        <span className="hidden lg:inline">Loading...</span>
      </div>
    );
  }

  if (servers.length === 0) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl text-sm sm:text-base text-muted-foreground">
        <Server className="h-4 w-4" />
        <span className="hidden lg:inline">No servers</span>
      </div>
    );
  }

  return (
    <Select
      value={selectedServerId?.toString() || ""}
      onValueChange={handleValueChange}
    >
      <SelectTrigger className="w-fit min-w-[120px] sm:min-w-[140px] border-border/40 hover:bg-muted/50">
        <div className="flex items-center gap-2">
          <Server className="h-4 w-4 shrink-0" />
          <SelectValue placeholder="Select server" />
        </div>
      </SelectTrigger>
      <SelectContent>
        {servers.map((server) => (
          <SelectItem key={server.id} value={server.id.toString()}>
            <div className="flex items-center gap-2">
              <span>{server.name}</span>
              <span className="text-xs text-muted-foreground">
                ({server.type})
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

