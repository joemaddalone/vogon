"use client";

import { useState, useActionState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldGroup,
  FieldLegend,
} from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { Updateable } from "kysely";
import { Configuration } from "@/lib/types";
import { useRouter } from "next/navigation";
import { ConfigField } from "./ConfigField";
import { useTranslations } from "next-intl";
export default function ConfigForm({ config }: { config: Configuration; }) {
  const t = useTranslations();
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const router = useRouter();
  const [configData, formAction, pending] = useActionState(
    async (prev: Configuration | null, data: FormData) => {
      const updateable: Updateable<Configuration> = {
        tmdbApiKey: data.get("tmdbApiKey") as string | undefined,
        fanartApiKey: data.get("fanartApiKey") as string | undefined,
        removeOverlays: data.get("removeOverlays") as unknown as
          | number
          | undefined,
        enableEpisodes: data.get("enableEpisodes") as unknown as
          | number
          | undefined,
        thePosterDbEmail: data.get("thePosterDbEmail") as string | undefined,
        thePosterDbPassword: data.get("thePosterDbPassword") as
          | string
          | undefined,
      };
      const result = await api.config.save(updateable);
      if (result.error) {
        setMessage({
          type: "error",
          text: result.error.message,
        });
        return prev;
      }
      setMessage({
        type: "success",
        text: t("config.savedSuccessfully"),
      });
      router.prefetch("/");
      router.prefetch("/movie");
      router.prefetch("/show");
      router.prefetch("/import");
      router.refresh();
      return result.data;
    },
    config
  );

  return (
    <div className="container max-w-2xl mx-auto px-4">
      <form action={formAction}>
        <FieldGroup className="p-4"></FieldGroup>
        <FieldGroup className="p-4 mt-5 bg-muted">
          <FieldLegend>
            {t("config.apiConfiguration")}
            <i className="text-sm text-orange-200 pl-3">
              {t("config.envPrecedence")}
            </i>
          </FieldLegend>

          <ConfigField
            configData={configData as Configuration}
            label={t("config.tmdb.label")}
            hint="env: TMDB_API_KEY"
            dataKey="tmdbApiKey"
            placeholder={t("config.tmdb.placeholder")}
            required
          >
            <a
              href="https://www.themoviedb.org/settings/api"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {t("config.getApiKey")}
            </a>
          </ConfigField>

          <ConfigField
            configData={configData as Configuration}
            label={t("config.fanart.label")}
            hint="env: FANART_API_KEY"
            dataKey="fanartApiKey"
            placeholder={t("config.fanart.placeholder")}
            required={false}
          >
            <a
              href="https://fanart.tv/get-an-api-key/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {t("config.getApiKey")}
            </a>
          </ConfigField>
          <ConfigField
            configData={configData as Configuration}
            label={t("config.posterDb.label")}
            hint="env: THEPOSTERDB_EMAIL"
            dataKey="thePosterDbEmail"
            placeholder={t("config.posterDb.placeholder")}
            required={false}
          >
          </ConfigField>
          <ConfigField
            configData={configData as Configuration}
            label={t("config.posterDbPassword.label")}
            hint="env: THEPOSTERDB_PASSWORD"
            dataKey="thePosterDbPassword"
            placeholder={t("config.posterDbPassword.placeholder")}
            type="password"
            required={false}
          >
          </ConfigField>
          <Field>
            <div className="flex items-center gap-2">
              <input
                id="removeOverlays"
                name="removeOverlays"
                type="checkbox"
                defaultChecked={configData?.removeOverlays ? true : false}
                className="h-4 w-4 rounded border-gray-300"
              />
              <FieldLabel htmlFor="removeOverlays" className="mb-0!">
                {t("config.overlays.label")}
                <span className="text-xs text-muted-foreground">
                  env: REMOVE_OVERLAYS
                </span>
              </FieldLabel>
            </div>
            <FieldDescription className="text-sm!">
              {t("config.overlays.description")}
              <span className="font-bold pl-2">({t("config.overlays.description2")})</span>
            </FieldDescription>
          </Field>
          <Field>
            <div className="flex items-center gap-2">
              <input
                id="enableEpisodes"
                name="enableEpisodes"
                type="checkbox"
                defaultChecked={configData?.enableEpisodes ? true : false}
                className="h-4 w-4 rounded border-gray-300"
              />
              <FieldLabel htmlFor="enableEpisodes" className="mb-0!">
                {t("config.episodes.label")}
                <span className="text-xs text-muted-foreground">
                  env: ENABLE_EPISODES
                </span>
              </FieldLabel>
            </div>
            <FieldDescription className="text-sm!">
              {t("config.episodes.description")}
            </FieldDescription>
          </Field>
          {message && (
            <div
              className={`p-4 rounded-md ${message.type === "success"
                ? "bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                : "bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                }`}
            >
              {message.text}
            </div>
          )}
          <div className="flex gap-4">
            <Button type="submit" disabled={pending}>
              {pending ? (
                <>
                  <Spinner className="mr-2" />
                  {t("common.saving")}
                </>
              ) : (
                t("common.save")
              )}
            </Button>
          </div>
        </FieldGroup>
      </form>
    </div>
  );
}
