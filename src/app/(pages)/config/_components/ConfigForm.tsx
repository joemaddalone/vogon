"use client";

import { useState, useActionState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export default function ConfigForm({ config }: { config: Configuration }) {

	const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);


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
		console.log(updateable);
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
		return result.data as Configuration;
	}, config);


  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Configuration</h1>
        <p className="text-muted-foreground">
          Configure your Plex server and API credentials. All values are stored
          securely in the local database.{" "}
          <i className="text-sm text-orange-200">
            Environment variables will take precedence here.
          </i>
        </p>
      </div>

      <form action={formAction}>
        <FieldGroup className="p-4">
          {/* Plex Server URL */}
          <Field>
            <FieldLabel htmlFor="plexServerUrl">
              Plex Server URL{" "}
              <span className="text-xs text-muted-foreground">
                env. PLEX_SERVER_URL
              </span>
            </FieldLabel>
            <Input
              className="h-12 px-3 text-lg"
              id="plexServerUrl"
              type="text"
              name="plexServerUrl"
              defaultValue={configData?.plexServerUrl || ""}
              placeholder="http://192.168.1.2:32400"
              required
            />
            <FieldDescription>
              Your Plex Media Server URL (usually local network IP with port
              32400)
            </FieldDescription>
          </Field>

          {/* Plex Token */}
          <Field>
            <FieldLabel htmlFor="plexToken">
              Plex Token{" "}
              <span className="text-xs text-muted-foreground">
                env. PLEX_TOKEN
              </span>
            </FieldLabel>
            <Input
              className="h-12 px-3 text-lg"
              id="plexToken"
              name="plexToken"
              type="password"
              defaultValue={configData?.plexToken || ""}
              placeholder="Enter your Plex token"
              required
            />
            <FieldDescription>
              Your Plex authentication token.{" "}
              <a
                href="https://support.plex.tv/articles/204059436-finding-an-authentication-token-x-plex-token/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                How to find your token
              </a>
            </FieldDescription>
          </Field>

          {/* TMDB API Key */}
          <Field>
            <FieldLabel htmlFor="tmdbApiKey">
              TMDB API Key{" "}
              <span className="text-xs text-muted-foreground">
                env. TMDB_API_KEY
              </span>
            </FieldLabel>
            <Input
              className="h-12 px-3 text-lg"
              id="tmdbApiKey"
              name="tmdbApiKey"
              type="password"
              defaultValue={configData?.tmdbApiKey || ""}
              placeholder="Enter your TMDB API key"
              required
            />
            <FieldDescription>
              The Movie Database (TMDB) API key for poster lookups.{" "}
              <a
                href="https://www.themoviedb.org/settings/api"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Get your API key
              </a>
            </FieldDescription>
          </Field>
        </FieldGroup>
        {/* Fanart API Key (Optional) */}
        <FieldGroup className="p-4 mt-5 bg-muted">
          <FieldLegend>Optional Fields</FieldLegend>
          <Field>
            <FieldLabel htmlFor="fanartApiKey">
              Fanart.tv API Key (Optional){" "}
              <span className="text-xs text-muted-foreground">
                env. FANART_API_KEY
              </span>
            </FieldLabel>
            <Input
              className="h-12 px-3 text-lg"
              id="fanartApiKey"
              name="fanartApiKey"
              type="password"
              defaultValue={configData?.fanartApiKey || ""}
              placeholder="Enter your Fanart.tv API key (optional)"
            />
            <FieldDescription>
              Optional: Fanart.tv API key for additional poster sources.{" "}
              <a
                href="https://fanart.tv/get-an-api-key/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Get your API key
              </a>
            </FieldDescription>
          </Field>
          {/* ThePosterDB Email */}
          <Field>
            <FieldLabel htmlFor="thePosterDbEmail">
              ThePosterDB Email{" "}
              <span className="text-xs text-muted-foreground">
                env. THEPOSTERDB_EMAIL
              </span>
            </FieldLabel>
            <Input
              className="h-12 px-3 text-lg"
              id="thePosterDbEmail"
              name="thePosterDbEmail"
              type="email"
              defaultValue={configData?.thePosterDbEmail || ""}
              placeholder="Enter your ThePosterDB email"
            />
            <FieldDescription>
              Your ThePosterDB email for poster lookups.
            </FieldDescription>
          </Field>
          {/* ThePosterDB Password */}
          <Field>
            <FieldLabel htmlFor="thePosterDbPassword">
              ThePosterDB Password{" "}
              <span className="text-xs text-muted-foreground">
                env. THEPOSTERDB_PASSWORD
              </span>
            </FieldLabel>
            <Input
              className="h-12 px-3 text-lg"
              id="thePosterDbPassword"
              name="thePosterDbPassword"
              type="password"
              defaultValue={configData?.thePosterDbPassword || ""}
              placeholder="Enter your ThePosterDB password"
            />
            <FieldDescription>
              Your ThePosterDB password for poster lookups.
            </FieldDescription>
          </Field>

          {/* Remove Overlays Checkbox */}
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

          {/* Message Display */}
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

          {/* Submit Button */}
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
