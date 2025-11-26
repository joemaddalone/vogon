export const dynamic = "force-dynamic";

import { api } from "@/lib/api";
import { Suspense } from "react";
import ConfigForm from "./_components/ConfigForm";
import { Servers } from "./_components/Servers";
import { Configuration } from "@/lib/types";

export default async function ConfigPage() {
  const result = await api.config.get();
  const config = result.data as unknown as Configuration;
  const servers = await api.server.get();

  return (
    <Suspense fallback={<div className="flex items-center justify-center">loading..</div>}>
      <div className="container max-w-2xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-2">Configuration</h1>
        <p>
          Configure your media server and API credentials. All values are stored
          securely in the local database.{" "}
        </p>
      </div>
      <div className="container max-w-2xl mx-auto">
        <Servers servers={servers?.data} />
      </div>

      <ConfigForm config={config} />
    </Suspense>
  )
}
