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

export default function ConfigForm({ config }: { config: Configuration }) {

	const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

	const router = useRouter();
	const [configData, formAction, pending] = useActionState(async (prev: Configuration | null, data: FormData) => {
		const updateable: Updateable<Configuration> = {
			plexServerUrl: data.get("plexServerUrl") as string | undefined,
			plexToken: data.get("plexToken") as string | undefined,
			tmdbApiKey: data.get("tmdbApiKey") as string | undefined,
			fanartApiKey: data.get("fanartApiKey") as string | undefined,
			removeOverlays: data.get("removeOverlays") as unknown as number | undefined,
			thePosterDbEmail: data.get("thePosterDbEmail") as string | undefined,
			thePosterDbPassword: data.get("thePosterDbPassword") as string | undefined,
		};
		const result = await api.config.save(updateable);
		if(result.error) {
      setMessage({
        type: "error",
        text: result.error.message,
      });
			return prev;
		}
		setMessage({
			type: "success",
			text: "Configuration saved successfully",
		});
		router.prefetch("/");
		router.prefetch("/movie");
		router.prefetch("/show");
		router.prefetch("/import");
		router.refresh();
		return result.data;
	}, config);


  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Configuration</h1>
        <p>
          Configure your Plex server and API credentials. All values are stored
          securely in the local database.{" "}
          <i className="text-sm text-orange-200">
            Environment variables will take precedence here.
          </i>
        </p>
      </div>

      <form action={formAction}>
        <FieldGroup className="p-4">
          <ConfigField
            configData={configData as Configuration}
            label="Plex Server URL"
            hint="env. PLEX_SERVER_URL"
            dataKey="plexServerUrl"
            placeholder="http://192.168.1.2:32400"
            required
          >
            Your Plex Media Server URL (usually local network IP with port 32400)
          </ConfigField>
          <ConfigField
            configData={configData as Configuration}
            label="Plex Token"
            hint="env. PLEX_TOKEN"
            dataKey="plexToken"
            placeholder="Enter your Plex token"
            required
          >
            Your Plex authentication token. <a href='https://support.plex.tv/articles/204059436-finding-an-authentication-token-x-plex-token/' target='_blank' rel='noopener noreferrer' className='text-primary hover:underline'>How to find your token</a>
          </ConfigField>
          <ConfigField
            configData={configData as Configuration}
            label="TMDB API Key"
            hint="env. TMDB_API_KEY"
            dataKey="tmdbApiKey"
            placeholder="Enter your TMDB API key"
            required
          >
            The Movie Database (TMDB) API key for poster lookups. <a href='https://www.themoviedb.org/settings/api' target='_blank' rel='noopener noreferrer' className='text-primary hover:underline'>Get your API key</a>
          </ConfigField>
        </FieldGroup>
        <FieldGroup className="p-4 mt-5 bg-muted">
          <FieldLegend>Optional Fields</FieldLegend>
          <ConfigField
            configData={configData as Configuration}
            label="Fanart.tv API Key"
            hint="env. FANART_API_KEY"
            dataKey="fanartApiKey"
            placeholder="Enter your Fanart.tv API key (optional)"
            required={false}
          >
            Optional: Fanart.tv API key for additional poster sources. <a href='https://fanart.tv/get-an-api-key/' target='_blank' rel='noopener noreferrer' className='text-primary hover:underline'>Get your API key</a>
          </ConfigField>
          <ConfigField
            configData={configData as Configuration}
            label="ThePosterDB Email"
            hint="env. THEPOSTERDB_EMAIL"
            dataKey="thePosterDbEmail"
            placeholder="Enter your ThePosterDB email"
            required={false}
          >
            Your ThePosterDB email for poster lookups.
          </ConfigField>
          <ConfigField
            configData={configData as Configuration}
            label="ThePosterDB Password"
            hint="env. THEPOSTERDB_PASSWORD"
            dataKey="thePosterDbPassword"
            placeholder="Enter your ThePosterDB password"
            type="password"
            required={false}
          >
            Your ThePosterDB password for poster lookups.
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
                Remove Overlays{" "}
                <span className="text-xs text-muted-foreground">
                  env. REMOVE_OVERLAYS
                </span>
              </FieldLabel>
            </div>
            <FieldDescription>
              Remove Plex overlay labels when updating posters{" "}
              <span className="font-bold">(useful for Kometa/PMM users)</span>
            </FieldDescription>
          </Field>
          {message && (
            <div
              className={`p-4 rounded-md ${
                message.type === "success"
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
                  Saving...
                </>
              ) : (
                "Save Configuration"
              )}
            </Button>
          </div>
        </FieldGroup>
      </form>
    </div>
  );
}
