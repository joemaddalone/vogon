export const dynamic = "force-dynamic";

import { api } from "@/lib/api";
import { Suspense } from "react";
import ConfigForm from "./_components/ConfigForm";
import { Configuration } from "@/lib/types";

export default async function ConfigPage() {
  const result = await api.config.get();
  const config = result.data as unknown as Configuration;
  console.log('config-----------------');
  console.log(config);

  return (
    <Suspense fallback={<div className="flex items-center justify-center">loading..</div>}>
      <ConfigForm config={config} />
    </Suspense>
  )
}
