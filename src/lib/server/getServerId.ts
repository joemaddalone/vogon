import { cookies } from "next/headers";
import { getServers } from "@/lib/client/database/server";

const COOKIE_NAME = "vogon-selected-server-id";

/**
 * Get the selected server ID from cookies
 * Falls back to first server if no cookie is set
 * Returns null if no servers are configured
 */
export async function getServerId(): Promise<number | null> {
  const cookieStore = await cookies();
  const serverIdCookie = cookieStore.get(COOKIE_NAME);

  if (serverIdCookie?.value) {
    const serverId = parseInt(serverIdCookie.value, 10);
    if (!isNaN(serverId)) {
      // Verify server still exists
      const servers = await getServers();
      if (servers.some((s) => s.id === serverId)) {
        return serverId;
      }
    }
  }

  // Fallback to first server
  const servers = await getServers();
  if (servers.length > 0) {
    return servers[0].id;
  }

  return null;
}

