export const dynamic = "force-dynamic";
import { api } from "@/lib/api";
import ConfigForm from "./_components/ConfigForm";
import { Servers } from "./_components/Servers";
import { CommonSuspense } from "@/components/CommonSuspense";
import { Configuration } from "@/lib/types";
import { getTranslations } from "next-intl/server";
export default async function ConfigPage() {
  const result = await api.config.get();
  const config = result.data as unknown as Configuration;
  const servers = await api.server.get();
  const t = await getTranslations();
  return (
    <CommonSuspense>
      <div className="container max-w-2xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-2">{t("config.title")}</h1>
        <p>
          {t("config.description")}
        </p>
      </div>
      <div className="container max-w-2xl mx-auto">
        <Servers servers={servers?.data} />
      </div>

      <ConfigForm config={config} />
    </CommonSuspense>
  )
}
