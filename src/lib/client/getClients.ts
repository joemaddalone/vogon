import { getConfiguration, getServers, getServer } from "./database";
import { FanartClient } from "./fanart";
import { TMDBWithFind } from "./tmdb";
import { ThePosterDbClient } from "./theposterdb";

export async function getClients(serverId?: number) {
  const envConfig = {
    plexServerUrl: '' as string | null,
    plexToken: '' as string | null,
    tmdbApiKey: process.env.TMDB_API_KEY,
    fanartApiKey: process.env.FANART_API_KEY,
    removeOverlays: process.env.REMOVE_OVERLAYS as string | number | undefined,
    thePosterDbEmail: process.env.THEPOSTERDB_EMAIL,
    thePosterDbPassword: process.env.THEPOSTERDB_PASSWORD,
    fanart: undefined as FanartClient | undefined,
    tmdb: undefined as TMDBWithFind | undefined,
    thePosterDb: undefined as ThePosterDbClient | undefined,
  };

  // remove undefined values from envConfig
  Object.keys(envConfig).forEach(key => {
    if (envConfig[key as keyof typeof envConfig] === undefined) {
      delete envConfig[key as keyof typeof envConfig];
    }
  });

  if(envConfig.removeOverlays) {
    envConfig.removeOverlays = envConfig.removeOverlays === "true" ? 1 : 0;
  }

  const dbConfig = (await getConfiguration()) || {};

  // Fetch specific server if serverId provided, otherwise fall back to first server
  let selectedServer = null;
  if (serverId) {
    selectedServer = await getServer(serverId);
    if (!selectedServer) {
      throw new Error(`Server with id ${serverId} not found`);
    }
  } else {
    // Fallback to first server for backward compatibility
    const dbServers = (await getServers()) || [];
    if (dbServers.length > 0) {
      selectedServer = dbServers[0];
    }
  }

  // Set server URL and token from selected server
  if (selectedServer) {
    envConfig.plexServerUrl = selectedServer.url;
    envConfig.plexToken = selectedServer.token;
  }

  const finalConfig = { ...dbConfig, ...envConfig };

  if(finalConfig.fanartApiKey) {
    finalConfig.fanart = new FanartClient(finalConfig.fanartApiKey) as FanartClient;
  }

  if(finalConfig.tmdbApiKey) {
    finalConfig.tmdb = new TMDBWithFind(finalConfig.tmdbApiKey) as TMDBWithFind;
  }

  if(finalConfig.thePosterDbEmail && finalConfig.thePosterDbPassword) {
    finalConfig.thePosterDb = new ThePosterDbClient(finalConfig.thePosterDbEmail, finalConfig.thePosterDbPassword) as ThePosterDbClient;
  }

  return finalConfig;
}
