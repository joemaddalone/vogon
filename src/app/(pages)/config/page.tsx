export const dynamic = "force-dynamic";

import { api } from "@/lib/api";
import { Suspense } from "react";
import ConfigForm from "./_components/ConfigForm";
import { Configuration } from "@/lib/types";
import { Servers } from "./_components/Servers";

export default async function ConfigPage() {
  const result = await api.config.get();
  const servers = await api.server.get();
  const config = result.data as unknown as Configuration;

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center">loading..</div>
      }
    >
      <div className="container max-w-2xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-2">Configuration</h1>
        <p>
          Configure your Plex server and API credentials. All values are stored
          securely in the local database.{" "}
          <i className="text-sm text-orange-200">
            Environment variables will take precedence here.
          </i>
        </p>
      </div>
      <div className="container max-w-2xl mx-auto">
        <Servers servers={servers?.data} />
      </div>
      <ConfigForm config={config} />
    </Suspense>
  );
}
