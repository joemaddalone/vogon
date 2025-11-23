"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Server as ServerIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Session, Server } from "@/lib/types";

export function ServerSelector({
  session,
  servers,
}: {
  session: Session;
  servers: Server[];
}) {
  const router = useRouter();

  const handleValueChange = async (value: string) => {
    const sessionId = session?.id?.toString() || "";
    const serverId = parseInt(value, 10);
    if (!isNaN(serverId)) {
      const result = await api.session.update({ sessionId: parseInt(sessionId, 10), serverId });
      if (result.error) {
        console.error(result.error);
      }
			router.refresh();
    }
  };

	const selectedServerId = session?.serverId?.toString();

  return (
    <Select
      value={selectedServerId?.toString() || ""}
      onValueChange={handleValueChange}
    >
      <SelectTrigger className="w-fit min-w-[120px] sm:min-w-[140px] border-border/40 hover:bg-muted/50">
        <div className="flex items-center gap-2">
          <ServerIcon className="h-4 w-4 shrink-0" />
          <SelectValue placeholder="Select server" />
        </div>
      </SelectTrigger>
      <SelectContent>
        {servers.map((server) => (
          <SelectItem key={server.id.toString()} value={server.id.toString()}>
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
